/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fpt.project.constant.StatusCode;
import com.fpt.project.model.Meeting;
import com.fpt.project.service.MeetingService;
import static com.fpt.project.util.ConverterUtils.returnListMeeting;
import static com.fpt.project.util.ConverterUtils.returnMeeting;
import com.fpt.project.util.ResponseUtils;
import java.util.List;
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
public class MeetingController {

    @Autowired
    private MeetingService calendarService;

    @PostMapping(value = "/meetings", produces = "application/json")
    public String createMeeting(@RequestBody Meeting calendar) {
        Meeting result = calendarService.createMeeting(calendar);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnMeeting(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/meetings/{id}", produces = "application/json")
    public String getMeeting(@PathVariable(name = "id") int id) {
        Meeting result = calendarService.getMeeting(id);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnMeeting(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @PutMapping(value = "/meetings/{id}", produces = "application/json")
    public String updateMeeting(@PathVariable(name = "id") int id, @RequestBody Meeting calendar) {
        Meeting result = calendarService.updateMeeting(id, calendar);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnMeeting(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/meetings/{id}", produces = "application/json")
    public String deleteMeeting(@PathVariable(name = "id") int id) {
        calendarService.deleteMeeting(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }

    @GetMapping(value = "/users/{id}/meetings", produces = "application/json")
    public String getMeetingByUser(@PathVariable(name = "id") int id) {
        List<Meeting> result = calendarService.getMeetingByUser(id);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListMeeting(result));
    }
}
