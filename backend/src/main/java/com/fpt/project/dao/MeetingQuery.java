/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dao;

import com.fpt.project.model.Meeting;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Phong
 */
@Repository
public class MeetingQuery extends PRepository {

    public List<Meeting> findByUser(int userId) {
        List<Meeting> result = new ArrayList<>();
        result.addAll(query(Meeting.class).where().eq("creater_id", userId).findList());
        result.addAll(query(Meeting.class).where().eq("inviter_id", userId).findList());
        return result;
    }
}
