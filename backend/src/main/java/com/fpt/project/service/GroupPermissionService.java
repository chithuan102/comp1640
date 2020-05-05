/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.PRepository;
import com.fpt.project.model.GroupPermission;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 *
 * @author Phong
 */
@Service
public class GroupPermissionService {

    @Autowired
    @Qualifier("PRepository")
    private PRepository pRepository;

    public GroupPermission createGroupPermission(GroupPermission groupPermission) {
        groupPermission.setDefaultGroupPermission(false);
        pRepository.save(groupPermission);
        return groupPermission;
    }

    public GroupPermission updateGroupPermission(int id, GroupPermission groupPermission) {
        GroupPermission db = getGroupPermission(id);

        db.setDescription(groupPermission.getDescription());  
        db.setStatus(groupPermission.isStatus());

        

        pRepository.update(groupPermission);
        return groupPermission;
    }

    public void deleteGroupPermission(int id) {
        pRepository.deleteById(GroupPermission.class, id);
    }

    public GroupPermission getGroupPermission(int id) {
        return pRepository.findById(GroupPermission.class, id);
    }

    public List<GroupPermission> getAll() {
        return pRepository.findAll(GroupPermission.class).collect(Collectors.toList());
    }
}
