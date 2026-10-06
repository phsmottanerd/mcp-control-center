package com.paulohenrique.mcp_control_center.repository;

import com.paulohenrique.mcp_control_center.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}
