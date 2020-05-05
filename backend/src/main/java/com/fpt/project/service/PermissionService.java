/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.PermissionQuery;
import com.fpt.project.model.Permission;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Phong
 */
@Service
public class PermissionService {

    @Autowired
    private PermissionQuery permissionQuery;

    public Permission createPermission(Permission permission) {
        permissionQuery.save(permission);
        return permission;
    }

    public Permission updatePermission(Permission permission) {
        permissionQuery.update(permission);
        return permission;
    }

    public List<Permission> updatePermission(List<Permission> permissions) {
        permissionQuery.saveAll(permissions);
        return permissions;
    }

    public void deletePermission(int id) {
        permissionQuery.deleteById(Permission.class, id);
    }

    public Permission getPermission(int id) {
        return permissionQuery.findById(Permission.class, id);
    }
}
