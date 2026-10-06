package com.paulohenrique.mcp_control_center.repository;

import com.paulohenrique.mcp_control_center.model.Conta;
import com.paulohenrique.mcp_control_center.model.StatusConta;
import com.paulohenrique.mcp_control_center.model.TipoConta;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Long> {
    boolean existsByNumeroConta(String numeroConta);
    boolean existsByNumeroContaAndIdNot(String numeroConta, Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select conta from Conta conta where conta.id = :id")
    Optional<Conta> buscarParaAtualizacao(@Param("id") Long id);

    @Query("select conta from Conta conta where " +
            "(:numero is null or lower(conta.numeroConta) like lower(concat('%', :numero, '%'))) and " +
            "(:agencia is null or lower(conta.agencia) like lower(concat('%', :agencia, '%'))) and " +
            "(:cliente is null or lower(conta.cliente) like lower(concat('%', :cliente, '%'))) and " +
            "(:tipo is null or conta.tipoConta = :tipo) order by conta.cliente, conta.numeroConta")
    List<Conta> pesquisar(@Param("numero") String numero, @Param("agencia") String agencia,
                          @Param("cliente") String cliente, @Param("tipo") TipoConta tipo);

    long countByStatus(StatusConta status);
    long countByTipoContaAndStatus(TipoConta tipoConta, StatusConta status);
}
