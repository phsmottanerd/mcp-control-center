package com.paulohenrique.mcp_control_center.controller;

import com.paulohenrique.mcp_control_center.service.CobolService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jobs/cobol")
public class CobolController {

    private final CobolService service;

    public CobolController(CobolService service) {
        this.service = service;
    }

    @PostMapping("/professores")
    public String executar() throws Exception {
        return service.executarJob();
    }
}
