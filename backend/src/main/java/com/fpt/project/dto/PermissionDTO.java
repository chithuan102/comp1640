/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dto;

import lombok.Data;

/**
 *
 * @author phong
 */
@Data
public class PermissionDTO {

    private boolean status;

    private String apiEndPoint;

    private String httpMethod;

    private String description;

}
