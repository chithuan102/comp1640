/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fpt.project.constant.StatusCode;
import com.fpt.project.service.UserService;
import static com.fpt.project.util.ConverterUtils.request2Json;
import static com.fpt.project.util.ConverterUtils.returnToken;
import com.fpt.project.util.ResponseUtils;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Phong
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/login", produces = "application/json")
    public String login(HttpServletRequest request) {
        JsonNode body = request2Json(request);
        String username = body.get("username").asText();
        String password = body.get("password").asText();
        String result = userService.signIn(username, password);
        return !result.isEmpty()
                ? ResponseUtils.success(StatusCode.SUCCESS, returnToken(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }
}
