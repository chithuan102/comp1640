/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fpt.project.constant.StatusCode;
import com.fpt.project.model.Department;
import com.fpt.project.service.DepartmentService;
import static com.fpt.project.util.ConverterUtils.returnDepartment;
import static com.fpt.project.util.ConverterUtils.returnListDepartment;
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
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping(value = "/departments", produces = "application/json")
    public String createDepartment(@RequestBody Department department) {
        Department result = departmentService.createDepartment(department);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnDepartment(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/departments/{id}", produces = "application/json")
    public String getDepartment(@PathVariable(name = "id") int id) {
        Department result = departmentService.getDepartment(id);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnDepartment(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/departments", produces = "application/json")
    public String getDepartment() {
        List<Department> result = departmentService.getAll();
        return ResponseUtils.success(StatusCode.SUCCESS, returnListDepartment(result));
    }

    @PutMapping(value = "/departments/{id}", produces = "application/json")
    public String updateDepartment(@PathVariable(name = "id") int id, @RequestBody Department department) {
        Department result = departmentService.updateDepartment(id, department);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnDepartment(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/departments/{id}", produces = "application/json")
    public String deleteDepartment(@PathVariable(name = "id") int id) {
        departmentService.deleteDepartment(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }
}
