package com.paulohenrique.mcp_control_center.dto;

import com.paulohenrique.mcp_control_center.model.StatusConta;
import com.paulohenrique.mcp_control_center.model.TipoConta;
import com.paulohenrique.mcp_control_center.model.TipoMovimentacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public final class ContaDtos {
    private ContaDtos() {}

    public record CriarContaRequest(
            @NotBlank @Size(max = 120) String cliente,
            @NotNull TipoConta tipoConta,
            @NotBlank @Size(max = 24) @Pattern(regexp = "[A-Za-z0-9-]+") String numeroConta,
            @NotBlank @Size(max = 12) @Pattern(regexp = "[A-Za-z0-9-]+") String agencia,
            @NotNull @DecimalMin("0.00") @Digits(integer = 17, fraction = 2) BigDecimal saldoInicial,
            StatusConta status,
            @NotNull LocalDate dataAbertura
    ) {}

    public record AtualizarContaRequest(
            @NotBlank @Size(max = 120) String cliente,
            @NotNull TipoConta tipoConta,
            @NotBlank @Size(max = 24) @Pattern(regexp = "[A-Za-z0-9-]+") String numeroConta,
            @NotBlank @Size(max = 12) @Pattern(regexp = "[A-Za-z0-9-]+") String agencia,
            @NotNull LocalDate dataAbertura
    ) {}

    public record OperacaoRequest(
            @NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal valor,
            @Size(max = 180) String descricao
    ) {}

    public record AlterarStatusRequest(@NotNull StatusConta status) {}

    public record MovimentacaoResponse(Long id, LocalDate data, String hora,
                                       TipoMovimentacao operacao, String descricao,
                                       BigDecimal valor, BigDecimal saldoAposOperacao) {}

    public record ContaResponse(Long id, String cliente, TipoConta tipoConta,
                                String numeroConta, String agencia, BigDecimal saldoAtual,
                                StatusConta status, LocalDate dataAbertura,
                                BigDecimal totalDepositado, BigDecimal totalSacado,
                                long quantidadeMovimentacoes,
                                MovimentacaoResponse ultimaMovimentacao) {}

    public record ResumoBancarioResponse(long contasAtivas, long contasCorrentes,
                                         long contasPoupanca, BigDecimal saldoTotal,
                                         long movimentacoes) {}

    public record ErroResponse(String mensagem) {}
}
