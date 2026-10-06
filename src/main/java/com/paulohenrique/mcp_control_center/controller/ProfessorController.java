package com.paulohenrique.mcp_control_center.controller;

import com.paulohenrique.mcp_control_center.model.Professor;
import com.paulohenrique.mcp_control_center.service.ProfessorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/professores")
public class ProfessorController {

    private final ProfessorService service;

    public ProfessorController(ProfessorService service) {
        this.service = service;
    }

    @PostMapping
    public Professor criar(@RequestBody Professor professor) {
        return service.salvar(professor);
    }

    @PutMapping("/{id}")
    public Professor atualizar(@PathVariable Long id, @RequestBody Professor professor) {
        professor.setId(id);
        return service.salvar(professor);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @GetMapping
    public List<Professor> listarTodos() {
        return service.listarTodos();
    }
}
