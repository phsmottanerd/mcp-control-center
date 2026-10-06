package com.paulohenrique.mcp_control_center.service;

import com.paulohenrique.mcp_control_center.dto.ContaDtos.AlterarStatusRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.AtualizarContaRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.ContaResponse;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.CriarContaRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.MovimentacaoResponse;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.OperacaoRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.ResumoBancarioResponse;
import com.paulohenrique.mcp_control_center.exception.RegraContaException;
import com.paulohenrique.mcp_control_center.model.Conta;
import com.paulohenrique.mcp_control_center.model.Movimentacao;
import com.paulohenrique.mcp_control_center.model.StatusConta;
import com.paulohenrique.mcp_control_center.model.TipoConta;
import com.paulohenrique.mcp_control_center.model.TipoMovimentacao;
import com.paulohenrique.mcp_control_center.repository.ContaRepository;
import com.paulohenrique.mcp_control_center.repository.MovimentacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class ContaService {
    private static final BigDecimal ZERO = new BigDecimal("0.00");

    private final ContaRepository contas;
    private final MovimentacaoRepository movimentacoes;

    public ContaService(ContaRepository contas, MovimentacaoRepository movimentacoes) {
        this.contas = contas;
        this.movimentacoes = movimentacoes;
    }

    @Transactional
    public ContaResponse criar(CriarContaRequest request) {
        if (contas.existsByNumeroConta(request.numeroConta().trim())) {
            throw new RegraContaException(HttpStatus.CONFLICT, "Já existe uma conta com este número.");
        }

        Conta conta = new Conta();
        conta.setCliente(request.cliente().trim());
        conta.setTipoConta(request.tipoConta());
        conta.setNumeroConta(request.numeroConta().trim());
        conta.setAgencia(request.agencia().trim());
        conta.setStatus(request.status() == null ? StatusConta.ATIVA : request.status());
        conta.setDataAbertura(request.dataAbertura());
        conta = contas.save(conta);

        BigDecimal inicial = request.saldoInicial().setScale(2);
        if (inicial.signum() > 0) {
            conta.adicionarMovimentacao(new Movimentacao(
                    TipoMovimentacao.DEPOSITO, "SALDO INICIAL", inicial, inicial,
                    request.dataAbertura().atStartOfDay()));
        }
        return resposta(contas.save(conta));
    }

    @Transactional(readOnly = true)
    public List<ContaResponse> pesquisar(String numeroConta, String agencia, String cliente, TipoConta tipoConta) {
        return contas.pesquisar(normalizar(numeroConta), normalizar(agencia), normalizar(cliente), tipoConta)
                .stream().map(this::resposta).toList();
    }

    @Transactional(readOnly = true)
    public ContaResponse consultar(Long id) {
        return resposta(buscar(id));
    }

    @Transactional
    public ContaResponse atualizar(Long id, AtualizarContaRequest request) {
        Conta conta = bloquearRegistro(id);
        String numero = request.numeroConta().trim();
        if (contas.existsByNumeroContaAndIdNot(numero, id)) {
            throw new RegraContaException(HttpStatus.CONFLICT, "Já existe uma conta com este número.");
        }
        conta.setCliente(request.cliente().trim());
        conta.setTipoConta(request.tipoConta());
        conta.setNumeroConta(numero);
        conta.setAgencia(request.agencia().trim());
        conta.setDataAbertura(request.dataAbertura());
        return resposta(contas.save(conta));
    }

    @Transactional
    public void excluir(Long id) {
        Conta conta = bloquearRegistro(id);
        if (movimentacoes.countByContaId(id) > 0) {
            throw new RegraContaException(HttpStatus.CONFLICT,
                    "Esta conta possui histórico. Bloqueie ou encerre a conta para preservar o extrato.");
        }
        contas.delete(conta);
    }

    @Transactional
    public ContaResponse depositar(Long id, OperacaoRequest request) {
        Conta conta = bloquearRegistro(id);
        validarContaOperavel(conta);
        BigDecimal valor = valorMonetario(request.valor());
        BigDecimal saldo = saldoAtual(id).add(valor);
        registrar(conta, TipoMovimentacao.DEPOSITO, descricao(request, "DEPÓSITO"), valor, saldo);
        return resposta(contas.save(conta));
    }

    @Transactional
    public ContaResponse sacar(Long id, OperacaoRequest request) {
        Conta conta = bloquearRegistro(id);
        validarContaOperavel(conta);
        BigDecimal valor = valorMonetario(request.valor());
        BigDecimal saldo = saldoAtual(id);
        if (saldo.compareTo(valor) < 0) {
            throw new RegraContaException(HttpStatus.UNPROCESSABLE_ENTITY, "Saldo insuficiente para realizar o saque.");
        }
        registrar(conta, TipoMovimentacao.SAQUE, descricao(request, "SAQUE"), valor, saldo.subtract(valor));
        return resposta(contas.save(conta));
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoResponse> extrato(Long id, TipoMovimentacao tipo, LocalDate de, LocalDate ate) {
        buscar(id);
        if (de != null && ate != null && de.isAfter(ate)) {
            throw new RegraContaException(HttpStatus.BAD_REQUEST, "A data inicial não pode ser posterior à data final.");
        }
        LocalDateTime inicio = de == null ? null : de.atStartOfDay();
        LocalDateTime fim = ate == null ? null : ate.plusDays(1).atStartOfDay().minusNanos(1);
        return movimentacoes.filtrarExtrato(id, tipo, inicio, fim).stream().map(this::resposta).toList();
    }

    @Transactional
    public ContaResponse alterarStatus(Long id, AlterarStatusRequest request) {
        Conta conta = bloquearRegistro(id);
        if (conta.getStatus() == StatusConta.ENCERRADA && request.status() != StatusConta.ENCERRADA) {
            throw new RegraContaException(HttpStatus.CONFLICT, "Uma conta encerrada não pode ser reativada.");
        }
        conta.setStatus(request.status());
        return resposta(contas.save(conta));
    }

    @Transactional(readOnly = true)
    public ResumoBancarioResponse resumo() {
        List<Conta> todas = contas.findAll();
        BigDecimal saldoTotal = todas.stream().map(conta -> saldoAtual(conta.getId()))
                .reduce(ZERO, BigDecimal::add);
        return new ResumoBancarioResponse(
                contas.countByStatus(StatusConta.ATIVA),
                contas.countByTipoContaAndStatus(TipoConta.CORRENTE, StatusConta.ATIVA),
                contas.countByTipoContaAndStatus(TipoConta.POUPANCA, StatusConta.ATIVA),
                saldoTotal.setScale(2), movimentacoes.count());
    }

    private Conta buscar(Long id) {
        return contas.findById(id).orElseThrow(() ->
                new RegraContaException(HttpStatus.NOT_FOUND, "Conta não encontrada."));
    }

    private Conta bloquearRegistro(Long id) {
        return contas.buscarParaAtualizacao(id).orElseThrow(() ->
                new RegraContaException(HttpStatus.NOT_FOUND, "Conta não encontrada."));
    }

    private void validarContaOperavel(Conta conta) {
        if (conta.getStatus() == StatusConta.BLOQUEADA) {
            throw new RegraContaException(HttpStatus.CONFLICT, "A conta está bloqueada e não aceita movimentações.");
        }
        if (conta.getStatus() == StatusConta.ENCERRADA) {
            throw new RegraContaException(HttpStatus.CONFLICT, "A conta está encerrada e não aceita movimentações.");
        }
    }

    private BigDecimal saldoAtual(Long contaId) {
        return movimentacoes.findByContaIdOrderByRealizadaEmDescIdDesc(contaId).stream()
                .findFirst().map(Movimentacao::getSaldoAposOperacao).orElse(ZERO).setScale(2);
    }

    private void registrar(Conta conta, TipoMovimentacao tipo, String descricao,
                           BigDecimal valor, BigDecimal saldo) {
        conta.adicionarMovimentacao(new Movimentacao(tipo, descricao, valor, saldo, LocalDateTime.now()));
    }

    private ContaResponse resposta(Conta conta) {
        List<Movimentacao> historico = movimentacoes.findByContaIdOrderByRealizadaEmDescIdDesc(conta.getId());
        BigDecimal totalDeposito = totalTipo(historico, TipoMovimentacao.DEPOSITO);
        BigDecimal totalSaque = totalTipo(historico, TipoMovimentacao.SAQUE);
        MovimentacaoResponse ultima = historico.isEmpty() ? null : resposta(historico.getFirst());
        BigDecimal saldo = historico.isEmpty() ? ZERO : historico.getFirst().getSaldoAposOperacao();
        return new ContaResponse(conta.getId(), conta.getCliente(), conta.getTipoConta(),
                conta.getNumeroConta(), conta.getAgencia(), saldo.setScale(2), conta.getStatus(),
                conta.getDataAbertura(), totalDeposito, totalSaque, historico.size(), ultima);
    }

    private MovimentacaoResponse resposta(Movimentacao movimentacao) {
        LocalDateTime dataHora = movimentacao.getRealizadaEm();
        return new MovimentacaoResponse(movimentacao.getId(), dataHora.toLocalDate(),
                dataHora.toLocalTime().withNano(0).toString(), movimentacao.getTipo(),
                movimentacao.getDescricao(), movimentacao.getValor(), movimentacao.getSaldoAposOperacao());
    }

    private BigDecimal totalTipo(List<Movimentacao> historico, TipoMovimentacao tipo) {
        return historico.stream().filter(movimentacao -> movimentacao.getTipo() == tipo)
                .map(Movimentacao::getValor).reduce(ZERO, BigDecimal::add).setScale(2);
    }

    private BigDecimal valorMonetario(BigDecimal valor) {
        if (valor == null || valor.signum() <= 0) {
            throw new RegraContaException(HttpStatus.BAD_REQUEST, "Informe um valor maior que zero.");
        }
        try {
            return valor.setScale(2, java.math.RoundingMode.UNNECESSARY);
        } catch (ArithmeticException exception) {
            throw new RegraContaException(HttpStatus.BAD_REQUEST, "Use no máximo duas casas decimais.");
        }
    }

    private String descricao(OperacaoRequest request, String padrao) {
        String informada = request.descricao();
        return informada == null || informada.isBlank() ? padrao : informada.trim();
    }

    private String normalizar(String filtro) {
        return filtro == null || filtro.isBlank() ? null : filtro.trim().toLowerCase(Locale.ROOT);
    }
}
