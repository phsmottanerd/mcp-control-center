package com.paulohenrique.mcp_control_center.repository;

import com.paulohenrique.mcp_control_center.model.Movimentacao;
import com.paulohenrique.mcp_control_center.model.TipoMovimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findByContaIdOrderByRealizadaEmDescIdDesc(Long contaId);

    @Query("select m from Movimentacao m where m.conta.id = :contaId and " +
            "(:tipo is null or m.tipo = :tipo) and " +
            "(:inicio is null or m.realizadaEm >= :inicio) and " +
            "(:fim is null or m.realizadaEm <= :fim) order by m.realizadaEm desc, m.id desc")
    List<Movimentacao> filtrarExtrato(@Param("contaId") Long contaId,
                                      @Param("tipo") TipoMovimentacao tipo,
                                      @Param("inicio") LocalDateTime inicio,
                                      @Param("fim") LocalDateTime fim);

    @Query("select coalesce(sum(case when m.tipo = :tipoDeposito then m.valor else 0 end), 0) " +
            "from Movimentacao m where m.conta.id = :contaId")
    BigDecimal totalPorTipo(@Param("contaId") Long contaId,
                            @Param("tipoDeposito") TipoMovimentacao tipo);

    long countByContaId(Long contaId);
}
