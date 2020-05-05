/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fpt.project.constant.StatusCode;
import com.fpt.project.model.BasePermission;
import com.fpt.project.service.BasePermissionService;
import static com.fpt.project.util.ConverterUtils.returnBasePermission;
import static com.fpt.project.util.ConverterUtils.returnListBasePermission;
import com.fpt.project.util.ResponseUtils;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Phong
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class BasePermissionController {

    @Autowired
    private BasePermissionService basePermissionService;

    @PostMapping(value = "/basePermissions", produces = "application/json")
    public String createBasePermission(@RequestBody BasePermission department) {
        BasePermission result = basePermissionService.createBasePermission(department);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnBasePermission(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/basePermissions/{id}", produces = "application/json")
    public String getBasePermission(@PathVariable(name = "id") int id) {
        BasePermission result = basePermissionService.getBasePermission(id);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnBasePermission(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/basePermissions", produces = "application/json")
    public String getBasePermission() {
        List<BasePermission> result = basePermissionService.getAll();
        return ResponseUtils.success(StatusCode.SUCCESS, returnListBasePermission(result));
    }

    @PutMapping(value = "/basePermissions/{id}", produces = "application/json")
    public String updateBasePermission(@PathVariable(name = "id") int id, @RequestBody BasePermission basePermission) {
        BasePermission result = basePermissionService.updateBasePermission(id, basePermission);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnBasePermission(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/basePermissions/{id}", produces = "application/json")
    public String deleteBasePermission(@PathVariable(name = "id") int id) {
        basePermissionService.deleteBasePermission(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }
}
