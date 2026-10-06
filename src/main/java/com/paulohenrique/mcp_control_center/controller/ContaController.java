package com.paulohenrique.mcp_control_center.controller;

import com.paulohenrique.mcp_control_center.dto.ContaDtos.AlterarStatusRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.AtualizarContaRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.ContaResponse;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.CriarContaRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.MovimentacaoResponse;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.OperacaoRequest;
import com.paulohenrique.mcp_control_center.dto.ContaDtos.ResumoBancarioResponse;
import com.paulohenrique.mcp_control_center.model.TipoConta;
import com.paulohenrique.mcp_control_center.model.TipoMovimentacao;
import com.paulohenrique.mcp_control_center.service.ContaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/contas")
public class ContaController {
    private final ContaService service;

    public ContaController(ContaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ContaResponse> criar(@Valid @RequestBody CriarContaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @GetMapping
    public List<ContaResponse> pesquisar(
            @RequestParam(required = false) String numeroConta,
            @RequestParam(required = false) String agencia,
            @RequestParam(required = false) String cliente,
            @RequestParam(required = false) TipoConta tipoConta) {
        return service.pesquisar(numeroConta, agencia, cliente, tipoConta);
    }

    @GetMapping("/resumo")
    public ResumoBancarioResponse resumo() {
        return service.resumo();
    }

    @GetMapping("/{id}")
    public ContaResponse consultar(@PathVariable Long id) {
        return service.consultar(id);
    }

    @PutMapping("/{id}")
    public ContaResponse atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarContaRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/saldo")
    public java.math.BigDecimal saldo(@PathVariable Long id) {
        return service.consultar(id).saldoAtual();
    }

    @PostMapping("/{id}/depositos")
    public ContaResponse depositar(@PathVariable Long id, @Valid @RequestBody OperacaoRequest request) {
        return service.depositar(id, request);
    }

    @PostMapping("/{id}/saques")
    public ContaResponse sacar(@PathVariable Long id, @Valid @RequestBody OperacaoRequest request) {
        return service.sacar(id, request);
    }

    @GetMapping("/{id}/extrato")
    public List<MovimentacaoResponse> extrato(
            @PathVariable Long id,
            @RequestParam(required = false) TipoMovimentacao tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
        return service.extrato(id, tipo, de, ate);
    }

    @PatchMapping("/{id}/status")
    public ContaResponse alterarStatus(@PathVariable Long id, @Valid @RequestBody AlterarStatusRequest request) {
        return service.alterarStatus(id, request);
    }
}
