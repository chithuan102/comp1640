/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fpt.project.constant.StatusCode;
import com.fpt.project.model.GroupPermission;
import com.fpt.project.service.GroupPermissionService;
import static com.fpt.project.util.ConverterUtils.returnGroupPermission;
import static com.fpt.project.util.ConverterUtils.returnListGroupPermission;
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
public class GroupPermissionController {

    @Autowired
    private GroupPermissionService groupPermissionService;

    @PostMapping(value = "/groupPermissions", produces = "application/json")
    public String createGroupPermission(@RequestBody GroupPermission groupPermission) {
        GroupPermission result = groupPermissionService.createGroupPermission(groupPermission);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnGroupPermission(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/groupPermissions/{id}", produces = "application/json")
    public String getGroupPermission(@PathVariable(name = "id") int id) {
        GroupPermission result = groupPermissionService.getGroupPermission(id);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnGroupPermission(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/groupPermissions", produces = "application/json")
    public String getGroupPermission() {
        List<GroupPermission> result = groupPermissionService.getAll();
        return ResponseUtils.success(StatusCode.SUCCESS, returnListGroupPermission(result));
    }

    @PutMapping(value = "/groupPermissions/{id}", produces = "application/json")
    public String updateGroupPermission(@PathVariable(name = "id") int id, @RequestBody GroupPermission groupPermission) {
        GroupPermission result = groupPermissionService.updateGroupPermission(id, groupPermission);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnGroupPermission(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/groupPermissions/{id}", produces = "application/json")
    public String deleteGroupPermission(@PathVariable(name = "id") int id) {
        groupPermissionService.deleteGroupPermission(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }
}
