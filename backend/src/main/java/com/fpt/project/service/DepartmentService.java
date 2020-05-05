/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.DepartmentQuery;
import com.fpt.project.model.Department;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Phong
 */
@Service
public class DepartmentService {

    @Autowired
    private DepartmentQuery departmentQuery;

    public Department createDepartment(Department department) {
        departmentQuery.save(department);
        return department;
    }

    public Department updateDepartment(int id, Department department) {
        Department db = getDepartment(id);

        db.setTitle(department.getTitle());

        departmentQuery.update(db);
        return department;
    }

    public void deleteDepartment(int id) {
        departmentQuery.deleteById(Department.class, id);
    }

    public Department getDepartment(int id) {
        return departmentQuery.findById(Department.class, id);
    }

    public List<Department> getAll() {
        return departmentQuery.findAll(Department.class).collect(Collectors.toList());
    }
}
