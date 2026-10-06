package com.paulohenrique.mcp_control_center.service;

import com.paulohenrique.mcp_control_center.model.Professor;
import com.paulohenrique.mcp_control_center.repository.ProfessorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository repository;

    public ProfessorService(ProfessorRepository repository) {
        this.repository = repository;
    }

    public Professor salvar(Professor professor) {
        if (professor.getId() != null) {
            Professor existente = repository.findById(professor.getId()).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado."));
            existente.setNome(professor.getNome());
            existente.setEmail(professor.getEmail());
            existente.setEspecialidade(professor.getEspecialidade());
            existente.setCargaHoraria(professor.getCargaHoraria());
            return repository.save(existente);
        }
        return repository.save(professor);
    }

    public void excluir(Long id) {
        Professor professor = repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado."));
        repository.delete(professor);
    }

    public List<Professor> listarTodos() {
        return repository.findAll();
    }
}
