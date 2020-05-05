/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import static com.fpt.project.config.InfoConfig.MAPPER;
import com.fpt.project.constant.StatusCode;
import com.fpt.project.service.UserService;
import com.fpt.project.util.ResponseUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Phong
 */
@RestController
@CrossOrigin(origins = "*")
public class UploadController {

    @Value("${multipart.upload.path}")
    public String STORAGE_UPLOAD_PATH;

    @Value("${linkHost}")
    public String linkHost;

    @Autowired
    public UserService userService;

    @PostMapping(value = "/upload", produces = "application/json")
    public String createDocument(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        int i = file.getOriginalFilename().lastIndexOf('.');
        String extensionName = file.getOriginalFilename().substring(i);
        String result = (UUID.randomUUID()) + extensionName;
        Path path = Paths.get(STORAGE_UPLOAD_PATH + result);
        Files.write(path, bytes);
        ObjectNode node = MAPPER.createObjectNode();
        node.put("fileName", result);
        node.put("url", linkHost + result);
        return StringUtils.isNotBlank(result)
                ? ResponseUtils.success(StatusCode.SUCCESS, node)
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/export/users", produces = "application/json")
    public String exportByRole(@RequestParam("role") String role) throws IOException {
        String result = userService.exportByRole(role);
        ObjectNode node = MAPPER.createObjectNode();
        node.put("fileName", result);
        node.put("url", linkHost + result);
        return StringUtils.isNotBlank(result)
                ? ResponseUtils.success(StatusCode.SUCCESS, node)
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/ping", produces = "application/json")
    public String ping() {
        return ResponseUtils.success(StatusCode.SUCCESS);
    }
}
