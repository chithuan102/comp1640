/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.BasePermissionQuery;
import com.fpt.project.model.BasePermission;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Phong
 */
@Service
public class BasePermissionService {

    @Autowired
    private BasePermissionQuery basePermissionQuery;

    public BasePermission createBasePermission(BasePermission basePermission) {
        basePermissionQuery.save(basePermission);
        return basePermission;
    }

    public BasePermission updateBasePermission(int id, BasePermission basePermission) {
        BasePermission db = getBasePermission(id);

        db.setApiEndPoint(basePermission.getApiEndPoint());
        db.setDescription(basePermission.getDescription());
        db.setHttpMethod(basePermission.getHttpMethod());

        basePermissionQuery.update(db);
        return db;
    }

    public List<BasePermission> updateBasePermission(List<BasePermission> basePermissions) {
        basePermissionQuery.saveAll(basePermissions);
        return basePermissions;
    }

    public void deleteBasePermission(int id) {
        basePermissionQuery.deleteById(BasePermission.class, id);
    }

    public BasePermission getBasePermission(int id) {
        return basePermissionQuery.findById(BasePermission.class, id);
    }

    public List<BasePermission> getAll() {
        return basePermissionQuery.findAll(BasePermission.class).collect(Collectors.toList());
    }
}
