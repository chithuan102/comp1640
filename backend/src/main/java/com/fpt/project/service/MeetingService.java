/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.MeetingQuery;
import com.fpt.project.model.Meeting;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author phong
 */
@Service
public class MeetingService {

    @Autowired
    private MeetingQuery meetingQuery;

    public Meeting createMeeting(Meeting meeting) {
        meetingQuery.save(meeting);
        return getMeeting(meeting.getId());
    }

    public Meeting updateMeeting(int id, Meeting meeting) {
        Meeting db = getMeeting(id);
        db.setNotes(meeting.getNotes());
        db.setPlace(meeting.getPlace());
        db.setStatus(meeting.isStatus());
        db.setTime(meeting.getTime());
        db.setTopic(meeting.getTopic());
        db.setType(meeting.getType());
        db.setStart(meeting.getStart());
        db.setEnd(meeting.getEnd());

        db.setCreater(meeting.getCreater());
        db.setInviter(meeting.getInviter());
        meetingQuery.update(db);

        return getMeeting(id);
    }

    public void deleteMeeting(int id) {
        meetingQuery.deleteById(Meeting.class, id);
    }

    public Meeting getMeeting(int id) {
        return meetingQuery.findById(Meeting.class, id);
    }

    public List<Meeting> getMeetingByUser(int userId) {
        return meetingQuery.findByUser(userId);
    }
}
