/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.ebean.annotation.Index;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.Data;

/**
 *
 * @author Phong
 */
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = User.class)
@Data
public class User extends BaseModel implements Serializable {

    private String firstName;
    private String lastName;
    private String fullName;
    @Index
    private String email;
    private String password;
    private String birthDate;
    private String address;
    private String gender;
    private String avatar;
    private String role;
    private String phoneNumber;
    private String province;
    private String nationality;
    private String dateActivated;
    private String idCardNumber;
    private String idCardType;
    private boolean checked;
    private String country;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastActiveDate;

    @ManyToOne(optional = true)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(optional = true)
    @JoinColumn(name = "group_permission_id")
    private GroupPermission groupPermission;

    @ManyToOne(optional = true)
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @OneToMany(mappedBy = "tutor")
    private List<User> students;

    @OneToMany(mappedBy = "creater")
    private List<Meeting> myMeetings;

    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

    @OneToMany(mappedBy = "user")
    private List<Document> documents;

    @OneToMany(mappedBy = "inviter")
    private List<Meeting> invitedMeetings;
}
