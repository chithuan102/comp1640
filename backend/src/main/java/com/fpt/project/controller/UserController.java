/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fpt.project.constant.StatusCode;
import com.fpt.project.dto.UserDTO;
import com.fpt.project.model.SendMail;
import com.fpt.project.model.User;
import com.fpt.project.service.UserService;
import static com.fpt.project.util.ConverterUtils.request2Json;
import static com.fpt.project.util.ConverterUtils.returnListUser;
import static com.fpt.project.util.ConverterUtils.returnUser;
import com.fpt.project.util.MailUitls;
import com.fpt.project.util.ResponseUtils;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
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
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/users", produces = "application/json")
    public String createUser(@RequestBody User user) {
        try {
            if (StringUtils.isBlank(user.getEmail())) {
                return ResponseUtils.invalid();
            }
            if (StringUtils.isNotBlank(user.getEmail())
                    && userService.isDuplicate(user.getEmail())) {
                return ResponseUtils.duplicate();
            }
            User result = userService.createUser(user);
            return result.getId() != 0
                    ? ResponseUtils.success(StatusCode.SUCCESS, returnUser(result))
                    : ResponseUtils.success(StatusCode.FAILED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.ServerError();
        }
    }

    @PostMapping(value = "/import/users", produces = "application/json")
    public String createMultiUser(@RequestBody List<User> users) {
        try {
            for (User user : users) {
                if (StringUtils.isBlank(user.getEmail())) {
                    return ResponseUtils.invalid();
                }
                if (StringUtils.isNotBlank(user.getEmail())
                        && userService.isDuplicate(user.getEmail())) {
                    return ResponseUtils.duplicate(user.getEmail());
                }
            }
            userService.createUser(users);
            return ResponseUtils.success(StatusCode.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.ServerError();
        }
    }

    @GetMapping(value = "/users/{id}", produces = "application/json")
    public String getUser(@PathVariable(name = "id") int id) {
        User result = userService.getUser(id);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnUser(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @PutMapping(value = "/users/{id}", produces = "application/json")
    public String updateUser(@PathVariable(name = "id") int id, @RequestBody User user) {
        User result = userService.updateUser(id, user);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnUser(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/users/{id}", produces = "application/json")
    public String deleteUser(@PathVariable(name = "id") int id) {
        userService.deleteUser(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }

    @GetMapping(value = "/users", produces = "application/json")
    public String getUser(HttpServletRequest httpServletRequest) {
        int page = Integer.parseInt(httpServletRequest.getParameter("page"));
        int pageSize = Integer.parseInt(httpServletRequest.getParameter("pageSize"));
        String role = httpServletRequest.getParameter("role");

        List<User> result;
        int totalCount;
        if (httpServletRequest.getParameter("searchText") != null && !httpServletRequest.getParameter("searchText").isEmpty()) {
            String searchText = httpServletRequest.getParameter("searchText");
            result = userService.getListByRoleSearchText(role, page, pageSize, searchText);
            totalCount = userService.countByRoleSearchText(role, searchText);
        } else {
            result = userService.getListByRole(role, page, pageSize);
            totalCount = userService.countByRole(role);
        }
        return ResponseUtils.success(StatusCode.SUCCESS, returnListUser(result, totalCount));
    }

    @GetMapping(value = "/user/email/{email}", produces = "application/json")
    public String getUserByEmail(@PathVariable(name = "email") String email) {
        User result = userService.getByEmail(email);
        return result != null
                ? ResponseUtils.success(StatusCode.SUCCESS, returnUser(result))
                : ResponseUtils.NotFound();
    }

    @GetMapping(value = "/users/email/{email}", produces = "application/json")
    public String getMultiByEmail(@PathVariable(name = "email") String email) {
        List<User> result = userService.getMultiByEmail(email);
        return result != null
                ? ResponseUtils.success(StatusCode.SUCCESS, returnListUser(result))
                : ResponseUtils.NotFound();
    }

    @GetMapping(value = "/students", produces = "application/json")
    public String getListStudent(HttpServletRequest httpServletRequest) {
        int page = Integer.parseInt(httpServletRequest.getParameter("page"));
        int pageSize = Integer.parseInt(httpServletRequest.getParameter("pageSize"));
        int tutorId = Integer.parseInt(httpServletRequest.getParameter("tutorId"));
        List<User> result = userService.findByTutor(tutorId, page, pageSize);
        int totalCount = userService.countByTutor(tutorId);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListUser(result, totalCount));
    }

    @PostMapping(value = "/students", produces = "application/json")
    public String assignTutor(HttpServletRequest httpServletRequest) {
        JsonNode body = request2Json(httpServletRequest);
        if (body.has("studentIds") && body.has("tutorId")) {
            JsonNode studentIds = body.get("studentIds");
            List<Integer> studentListId = new ArrayList<>(studentIds.size());
            if (studentIds.isArray()) {
                for (JsonNode studentId : studentIds) {
                    studentListId.add(studentId.asInt());
                }
                int tutorId = body.get("tutorId").asInt();
                userService.assignTutor(tutorId, studentListId);
                return ResponseUtils.success(StatusCode.SUCCESS);
            }
        }
        return ResponseUtils.invalid();
    }

    @PostMapping(value = "/requestCode", produces = "application/json")
    public String requestCode(@RequestBody UserDTO user) {
        try {
            userService.requestToken(user.getEmail());
            return ResponseUtils.success(StatusCode.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.ServerError();
        }
    }

    @PostMapping(value = "/resetPassword", produces = "application/json")
    public String changePassword(@RequestBody UserDTO user) {
        try {
            boolean result = userService.changePassword(user);
            return result
                    ? ResponseUtils.success(StatusCode.SUCCESS)
                    : ResponseUtils.invalid();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.ServerError();
        }
    }

    @PostMapping(value = "/change-password", produces = "application/json")
    public String changeByOldPasswrod(@RequestBody UserDTO user) {
        try {
            boolean result = userService.changeByOldPassword(user);
            return result ? ResponseUtils.success(StatusCode.SUCCESS) : ResponseUtils.success(StatusCode.FAILED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.ServerError();
        }
    }
    @PostMapping(value = "/send-mail", produces = "application/json")
    public String sendMail(@RequestBody SendMail mail) {
        try {
            MailUitls.sendMail(mail.getEmail(), "Notification", mail.getText());
            return  ResponseUtils.success(StatusCode.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.ServerError();
        }
    }

}
