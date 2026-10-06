package com.paulohenrique.mcp_control_center.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
public class Movimentacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TipoMovimentacao tipo;

    @Column(nullable = false, length = 180)
    private String descricao;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal saldoAposOperacao;

    @Column(nullable = false)
    private LocalDateTime realizadaEm;

    protected Movimentacao() {}

    public Movimentacao(TipoMovimentacao tipo, String descricao, BigDecimal valor,
                        BigDecimal saldoAposOperacao, LocalDateTime realizadaEm) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
        this.saldoAposOperacao = saldoAposOperacao;
        this.realizadaEm = realizadaEm;
    }

    public Long getId() { return id; }
    public Conta getConta() { return conta; }
    public void setConta(Conta conta) { this.conta = conta; }
    public TipoMovimentacao getTipo() { return tipo; }
    public String getDescricao() { return descricao; }
    public BigDecimal getValor() { return valor; }
    public BigDecimal getSaldoAposOperacao() { return saldoAposOperacao; }
    public LocalDateTime getRealizadaEm() { return realizadaEm; }
}
