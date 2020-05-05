/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.model;

import javax.persistence.Entity;
import lombok.Data;

/**
 *
 * @author Phong
 */
@Entity
@Data
public class BasePermission extends BaseModel {

    private String apiEndPoint;

    private String httpMethod;

    private String description;

}
