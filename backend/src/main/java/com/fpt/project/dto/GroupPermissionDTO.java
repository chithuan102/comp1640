/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dto;

import java.util.List;
import lombok.Data;

/**
 *
 * @author phong
 */
@Data
public class GroupPermissionDTO {

    private String description;

    private boolean defaultGroupPermission;

    private List<PermissionDTO> permissions;

}
