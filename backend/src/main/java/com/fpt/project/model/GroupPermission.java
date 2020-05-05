/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import lombok.Data;

/**
 *
 * @author Phong
 */
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = GroupPermission.class)
@Data
public class GroupPermission extends BaseModel implements Serializable {

    private String description;

    private boolean defaultGroupPermission;

    @OneToMany(mappedBy = "groupPermission", cascade = CascadeType.ALL)
    private List<Permission> permissions;

    @OneToMany(mappedBy = "groupPermission")
    private List<User> users;

}
