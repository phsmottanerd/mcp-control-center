package com.paulohenrique.mcp_control_center.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contas")
public class Conta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoConta tipoConta;

    @Column(nullable = false, unique = true, length = 24)
    private String numeroConta;

    @Column(nullable = false, length = 12)
    private String agencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private StatusConta status;

    @Column(nullable = false)
    private LocalDate dataAbertura;

    @Version
    private Long versao;

    @OneToMany(mappedBy = "conta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Movimentacao> movimentacoes = new ArrayList<>();

    public Conta() {}

    public void adicionarMovimentacao(Movimentacao movimentacao) {
        movimentacao.setConta(this);
        movimentacoes.add(movimentacao);
    }

    public Long getId() { return id; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public TipoConta getTipoConta() { return tipoConta; }
    public void setTipoConta(TipoConta tipoConta) { this.tipoConta = tipoConta; }
    public String getNumeroConta() { return numeroConta; }
    public void setNumeroConta(String numeroConta) { this.numeroConta = numeroConta; }
    public String getAgencia() { return agencia; }
    public void setAgencia(String agencia) { this.agencia = agencia; }
    public StatusConta getStatus() { return status; }
    public void setStatus(StatusConta status) { this.status = status; }
    public LocalDate getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDate dataAbertura) { this.dataAbertura = dataAbertura; }
}
