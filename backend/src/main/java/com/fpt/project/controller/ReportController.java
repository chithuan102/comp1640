/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fpt.project.constant.StatusCode;
import com.fpt.project.model.User;
import com.fpt.project.service.UserService;
import static com.fpt.project.util.ConverterUtils.returnListUser;
import com.fpt.project.util.ResponseUtils;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Phong
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ReportController {

    @Autowired
    private UserService userService;

    @GetMapping(value = "/reports/unactive", produces = "application/json")
    public String findUnactiveUser(HttpServletRequest httpServletRequest) {
        int page = Integer.parseInt(httpServletRequest.getParameter("page"));
        int pageSize = Integer.parseInt(httpServletRequest.getParameter("pageSize"));
        String role = httpServletRequest.getParameter("role");
        List<User> result = userService.findUnactiveUser(role, page, pageSize);
        int totalCount = userService.countByRoleByDateActivePaging(role, page, pageSize);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListUser(result, totalCount));
    }

    @GetMapping(value = "/reports/no-tutor", produces = "application/json")
    public String findByRoleWithoutTutorPaging(HttpServletRequest httpServletRequest) {
        int page = Integer.parseInt(httpServletRequest.getParameter("page"));
        int pageSize = Integer.parseInt(httpServletRequest.getParameter("pageSize"));
        String role = httpServletRequest.getParameter("role");
        List<User> result = userService.findByRoleWithoutTutorPaging(role, page, pageSize);
        int totalCount = userService.countByRoleWithoutTutorPaging(role, page, pageSize);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListUser(result, totalCount));
    }
}
