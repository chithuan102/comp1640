/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.UserQuery;
import com.fpt.project.dto.GroupPermissionDTO;
import com.fpt.project.dto.UserDTO;
import com.fpt.project.model.User;
import com.fpt.project.redis.PermissionDataCA;
import com.fpt.project.redis.ResetTokenCA;
import com.fpt.project.redis.UserHistoryTokenCA;
import com.fpt.project.redis.UserLoginCA;
import com.fpt.project.redis.UserTokenCA;
import com.fpt.project.util.CSVUtils;
import com.fpt.project.util.ConverterUtils;
import com.fpt.project.util.MailUitls;
import com.fpt.project.util.StringUtil;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 *
 * @author Phong
 */
@Service
public class UserService {

    @Autowired
    private UserQuery userQuery;

    @Autowired
    private UserHistoryTokenCA userHistoryTokenCA;

    @Autowired
    private UserLoginCA userLoginCA;

    @Autowired
    private UserTokenCA userTokenCA;

    @Autowired
    private PermissionDataCA permissionDataCA;

    @Autowired
    private ResetTokenCA resetTokenCA;

    @Value("${multipart.upload.path}")
    public String STORAGE_UPLOAD_PATH;

    public String signIn(String username, String password) {
        String token = StringUtil.generateToken();
        int redisUserId = userLoginCA.getUid(username);
        if (redisUserId != 0) {
            User user = userQuery.findByEmail(username);
            if (user != null && user.getPassword().equals(password)) {
                userTokenCA.add(token, redisUserId);
                userLoginCA.add(username, redisUserId);
                userHistoryTokenCA.add(redisUserId, token);
                user.setLastActiveDate(new Date());
                userQuery.save(user);
                notiToUser(redisUserId, user.getRole());
                return redisUserId + "_" + token;
            }
        }
        return "";
    }

    public void notiToUser(int id, String role) {
        if (role.equals("STUDENT")) {
            User student = userQuery.findById(User.class, id);
            User tutor = student.getTutor();
            if (tutor != null) {
                String body = String.format("Your student %s has logged in.", student.getFullName());
                MailUitls.sendMail(tutor.getEmail(), "Notification", body);
            }
        } else if (role.equals("TUTOR")) {
            User tutor = userQuery.findById(User.class, id);
            List<User> students = tutor.getStudents();
            String body = String.format("Your tutor %s has logged in.", tutor.getFullName());
            students.stream().forEach(student -> MailUitls.sendMail(student.getEmail(), "Notification", body));
        }
    }

    public boolean authenticateToken(int userId, String token) {
        return userTokenCA.getUserId(token) == userId;
    }

    public List<User> getAll() {
        return userQuery.findAll(User.class).collect(Collectors.toList());
    }

    public User createUser(User user) {
        user.setPassword("1");
        userQuery.save(user);
        permissionDataCA.insert(user.getId(),
                ConverterUtils.convertObject(user.getGroupPermission(), GroupPermissionDTO.class));
        userLoginCA.add(user.getEmail(), user.getId());
        return getUser(user.getId());
    }

    public void createUser(List<User> users) {
        for (User user : users) {
            user.setPassword("1");
            userQuery.save(user);
            permissionDataCA.insert(user.getId(),
                    ConverterUtils.convertObject(user.getGroupPermission(), GroupPermissionDTO.class));
            userLoginCA.add(user.getEmail(), user.getId());
        }
    }

    public User getByEmail(String email) {
        return userQuery.findByEmail(email);
    }

    public User updateUser(int id, User user) {
        User db = userQuery.findById(User.class, id);
        System.out.println(user.isStatus());
        db.setAvatar(user.getAvatar());
        db.setBirthDate(user.getBirthDate());
        db.setFirstName(user.getFirstName());
        db.setFullName(user.getFullName());
        db.setGender(user.getGender());
        db.setAddress(user.getAddress());
        db.setLastName(user.getLastName());
        db.setDepartment(user.getDepartment());
        db.setGroupPermission(user.getGroupPermission());
        db.setIdCardNumber(user.getIdCardNumber());
        db.setIdCardType(user.getIdCardType());
        db.setProvince(user.getProvince());
        db.setPhoneNumber(user.getPhoneNumber());
        db.setGroupPermission(user.getGroupPermission());
        db.setStatus(user.isStatus());
        db.setNationality(user.getNationality());
        db.setCountry(user.getCountry());
        db.setRole(user.getRole());        
        db.setPassword(user.getPassword());

        db.setTutor(user.getTutor());

        if (!user.getEmail().equals(db.getEmail())) {
            userLoginCA.delete(db.getEmail());
            userLoginCA.add(user.getEmail(), id);
            db.setEmail(user.getEmail());
        }
        userQuery.save(db);
        permissionDataCA.update(user.getId(),
                ConverterUtils.convertObject(user.getGroupPermission(), GroupPermissionDTO.class));
        return getUser(id);
    }

    public User getUser(int id) {
        return userQuery.findById(User.class, id);
    }

    public void deleteUser(int id) {
        User user = getUser(id);
        if (user != null) {
            Set<String> listCurentToken = userHistoryTokenCA.getToken(id);
            userTokenCA.deleteToken(listCurentToken);
            userHistoryTokenCA.deleteToken(id);
            userLoginCA.delete(user.getEmail());
            userQuery.delete(user);
            permissionDataCA.delete(id);
        }
    }

    public List<User> getListByRole(String role, int page, int pageSize) {
        return userQuery.findByRolePaging(role, page, pageSize);
    }

    public List<User> getListByRoleSearchText(String role, int page, int pageSize, String searchText) {
        return userQuery.findByRolePagingSearchText(role, page, pageSize, searchText);
    }

    public List<User> getListByEmail(String fullName, int page, int pageSize) {
        return userQuery.findByEmailPaging(fullName, page, pageSize);
    }

    public List<User> getListByFullname(String fullName, int page, int pageSize) {
        return userQuery.findByFullNamePaging(fullName, page, pageSize);
    }

    public List<User> findByTutor(int tutorId, int page, int pageSize) {
        return userQuery.findByTutorPaging(tutorId, page, pageSize);
    }

    public List<User> findAll(int page, int pageSize) {
        return userQuery.findAllPaging(page, pageSize);
    }

    public List<User> getMultiByEmail(String email) {
        return userQuery.findMultiByEmail(email);
    }

    public int countAll() {
        return userQuery.countAll();
    }

    public int countByRole(String role) {
        return userQuery.countByRole(role);
    }

    public int countByRoleSearchText(String role, String searchText) {
        return userQuery.countByRoleSearchText(role, searchText);
    }

    public int countByFullName(String fullName) {
        return userQuery.countByFullName(fullName);
    }

    public int countByEmail(String email) {
        return userQuery.countByEmail(email);
    }

    public int countByTutor(int tutorId) {
        return userQuery.countByTutor(tutorId);
    }

    public boolean assignTutor(int tutorId, List<Integer> studentIds) {
        List<User> students = userQuery.findByIds(studentIds);
        User tutor = userQuery.findById(User.class, tutorId);
        tutor.setStudents(students);
//        students.stream().forEach(student -> student.setTutor(tutor));
//        userQuery.saveAll(students);
        userQuery.save(tutor);

        String studentBodyEmail = String.format("You are assigned a tutor. Name is %s", tutor.getFullName());
        students.stream().forEach(student
                -> MailUitls.sendMail(student.getEmail(), "Notification", studentBodyEmail));

        List<String> listStudentName = students.stream().map(student -> student.getFullName()).collect(Collectors.toList());

        String joined = listStudentName.stream()
                .map(Object::toString)
                .collect(Collectors.joining(", "));
        String tutorBodyEmail = "You are assigned students. They are " + joined;
        MailUitls.sendMail(tutor.getEmail(), "Notification", tutorBodyEmail);
        return true;
    }

    public boolean isDuplicate(String email) {
        return userLoginCA.getUid(email) != 0
                || userQuery.findByEmail(email) != null;
    }

    public void requestToken(String email) {
        Random rnd = new Random();
        int code = 100000 + rnd.nextInt(900000);
        resetTokenCA.add(code, email);
        MailUitls.sendMail(email, "code", code + "");
    }

    public boolean changePassword(UserDTO user) {
        String email = user.getEmail();
        int code = user.getCode();
        String newPassword = user.getNewPassword();
        if (isValidCode(email, code)) {
            User db = userQuery.findByEmail(email);
            db.setPassword(newPassword);
            userQuery.save(db);

            Set<String> oldToken = userHistoryTokenCA.getToken(db.getId());
            userTokenCA.deleteToken(oldToken);
            userHistoryTokenCA.deleteToken(db.getId());
            return true;
        }
        return false;
    }

    public boolean changeByOldPassword(UserDTO user) {
        User db = userQuery.findByEmail(user.getEmail());
        if (db.getPassword().equals(user.getOldPassword())) {
            db.setPassword(user.getPassword());
            userQuery.save(db);
            return true;
        }

        return false;
    }

    public boolean isValidCode(String email, int code) {
        return resetTokenCA.isValidToken(code, email);
    }

    public List<User> findByRoleWithoutTutorPaging(String role, int page, int pageSize) {
        return userQuery.findByRoleWithoutTutorPaging(role, page, pageSize);
    }

    public List<User> findUnactiveUser(String role, int page, int pageSize) {
        Date date = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
        return userQuery.findByRoleByDateActivePaging(role, page, pageSize, date);
    }

    public int countByRoleWithoutTutorPaging(String role, int page, int pageSize) {
        return userQuery.countByRoleWithoutTutorPaging(role, page, pageSize);
    }

    public int countByRoleByDateActivePaging(String role, int page, int pageSize) {
        Date date = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
        return userQuery.countByRoleByDateActivePaging(role, page, pageSize, date);
    }

    public String exportByRole(String role) {
        List<User> users = userQuery.findByRole(role);
        String csvFile = "user_" + (new Date()).getTime() + ".csv";
        try {
            FileWriter writer = new FileWriter(STORAGE_UPLOAD_PATH + csvFile);
            CSVUtils.writeLine(writer, Arrays.asList("Id", "fullName", "email", "birthDate", "address", "gender", "role", "phoneNumber", "province",
                    "nationality", "dateActivated", "idCardNumber", "idCardType", "country", "department"));
            for (User user : users) {

                List<String> list = new ArrayList<>();
                list.add(user.getId() + "");
                list.add(StringUtils.isNotBlank(user.getFullName()) ? user.getFullName() : "");
                list.add(StringUtils.isNotBlank(user.getEmail()) ? user.getEmail() : "");
                list.add(StringUtils.isNotBlank(user.getBirthDate()) ? user.getBirthDate() : "");
                list.add(StringUtils.isNotBlank(user.getAddress()) ? user.getAddress() : "");
                list.add(StringUtils.isNotBlank(user.getGender()) ? user.getGender() : "");
                list.add(StringUtils.isNotBlank(user.getRole()) ? user.getRole() : "");
                list.add(StringUtils.isNotBlank(user.getPhoneNumber()) ? user.getPhoneNumber() : "");
                list.add(StringUtils.isNotBlank(user.getProvince()) ? user.getProvince() : "");
                list.add(StringUtils.isNotBlank(user.getNationality()) ? user.getNationality() : "");
                list.add(StringUtils.isNotBlank(user.getDateActivated()) ? user.getDateActivated() : "");
                list.add(StringUtils.isNotBlank(user.getIdCardNumber()) ? user.getIdCardNumber() : "");
                list.add(StringUtils.isNotBlank(user.getIdCardType()) ? user.getIdCardType() : "");
                list.add(StringUtils.isNotBlank(user.getCountry()) ? user.getCountry() : "" + "");
                list.add(StringUtils.isNotBlank(user.getDepartment().getTitle()) ? user.getDepartment().getTitle() : "");

                CSVUtils.writeLine(writer, list);
            }

            writer.flush();
            writer.close();
        } catch (IOException ex) {
            Logger.getLogger(UserService.class.getName()).log(Level.SEVERE, null, ex);
        }
        return csvFile;
    }

}
