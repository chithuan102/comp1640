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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import lombok.Data;

/**
 *
 * @author Phong
 */
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = Meeting.class)
@Data
public class Meeting extends BaseModel implements Serializable {

    private Long time;
    private String place;
    private String type;
    private String topic;
    private String notes;
    private String start;
    private String end;

    @ManyToOne(optional = true)
    @JoinColumn(name = "creater_id")
    private User creater;

    @ManyToOne(optional = true)
    @JoinColumn(name = "inviter_id")
    private User inviter;
}
