package com.paulohenrique.mcp_control_center.exception;

import com.paulohenrique.mcp_control_center.dto.ContaDtos.ErroResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RegraContaException.class)
    public ResponseEntity<ErroResponse> regraConta(RegraContaException exception) {
        return ResponseEntity.status(exception.getStatus()).body(new ErroResponse(exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException exception) {
        String mensagem = exception.getBindingResult().getFieldErrors().stream()
                .findFirst().map(erro -> erro.getDefaultMessage())
                .orElse("Verifique os dados informados.");
        return ResponseEntity.badRequest().body(new ErroResponse(mensagem));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErroResponse> formatoInvalido(Exception exception) {
        return ResponseEntity.badRequest().body(new ErroResponse("Dados inválidos. Verifique tipo, data e formato dos valores."));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> conflitoDados(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErroResponse("Não foi possível salvar: existe um conflito com os dados cadastrados."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> erroInterno(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErroResponse("Não foi possível concluir a operação. Tente novamente."));
    }
}
