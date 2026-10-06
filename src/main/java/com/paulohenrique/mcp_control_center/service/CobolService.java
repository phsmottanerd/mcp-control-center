package com.paulohenrique.mcp_control_center.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class CobolService {

    public String executarJob() throws Exception {
        ProcessBuilder processBuilder =
                new ProcessBuilder("./cobol/jobs/PROFPROC");

        processBuilder.redirectErrorStream(true);

        Process processo = processBuilder.start();

        StringBuilder resultado = new StringBuilder();

        try (BufferedReader reader =
                     new BufferedReader(
                             new InputStreamReader(processo.getInputStream()))) {

            String linha;

            while ((linha = reader.readLine()) != null) {
                resultado.append(linha).append("\n");
            }
        }

        processo.waitFor();

        return resultado.toString();
    }
}
