/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dto;

import lombok.Data;

/**
 *
 * @author Phong
 */
@Data
public class UserDTO {

    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String newPassword;
    private String birthDate;
    private String hometown;
    private String gender;
    private String avatar;
    private String rolee;
    private String phoneNumber;
    private String province;
    private String nationality;
    private String dateActivated;
    private String idCardNumber;
    private String idCardType;
    private int code;
    private boolean checked;
    private boolean isActivated;
    private UserDTO tutor;
    private GroupPermissionDTO groupPermission;
    private DepartmentDTO department;
    private String oldPassword;

}
