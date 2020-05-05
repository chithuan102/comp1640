/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import static com.fpt.project.config.InfoConfig.MAPPER;
import com.fpt.project.model.BasePermission;
import com.fpt.project.model.Comment;
import com.fpt.project.model.Department;
import com.fpt.project.model.Document;
import com.fpt.project.model.GroupPermission;
import com.fpt.project.model.Meeting;
import com.fpt.project.model.Permission;
import com.fpt.project.model.User;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import org.dozer.DozerBeanMapper;

/**
 *
 * @author Phong
 */
public class ConverterUtils {

    private static DozerBeanMapper DOZER_MAPPER = new DozerBeanMapper();

    public static String linkHost;

    public static <E, T> E convertObject(T input, Class<E> clazz) {
        return DOZER_MAPPER.map(input, clazz);
    }

    public static <E, T> List<E> convertList(List<T> input, Class<E> clazz) {
        List<E> listModel = new ArrayList<>();
        for (T t : input) {
            listModel.add(DOZER_MAPPER.map(t, clazz));
        }
        return listModel;
    }

    public static JsonNode request2Json(HttpServletRequest request) {
        try {
            String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            return MAPPER.readTree(body);
        } catch (IOException ex) {
            Logger.getLogger(ConverterUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public static ObjectNode returnToken(String token) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("token", token);
        return node;
    }

    public static ObjectNode returnUser(User user) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", user.getId());
        node.put("avatar", user.getAvatar());
        node.put("birthDate", user.getBirthDate());
        node.put("email", user.getEmail());
        node.put("firstName", user.getFirstName());
        node.put("lastName", user.getLastName());
        node.put("fullName", user.getFullName());
        node.put("gender", user.getGender());
        node.put("address", user.getAddress());
        node.put("role", user.getRole());
        node.put("lastDateActive", user.getLastActiveDate() != null ? user.getLastActiveDate().getTime() : 0);
        node.put("idCardNumber", user.getIdCardNumber());
        node.put("idCardType", user.getIdCardType());
        node.put("nationality", user.getNationality());
        node.put("phoneNumber", user.getPhoneNumber());
        node.put("province", user.getProvince());
        node.put("isActivated", user.isStatus());
        node.put("country", user.getCountry());
        node.put("status", user.isStatus());
        node.put("password", user.getPassword());

        if (user.getTutor() != null) {
            node.set("tutor", returnUser(user.getTutor()));
        }
        node.set("department", returnDepartment(user.getDepartment()));
        node.set("groupPermission", returnGroupPermission(user.getGroupPermission()));
        return node;
    }

    public static ObjectNode returnMinUser(User user) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", user.getId());
        node.put("avatar", user.getAvatar());
        node.put("email", user.getEmail());
        node.put("firstName", user.getFirstName());
        node.put("fullName", user.getFullName());
        node.put("lastName", user.getLastName());
        node.put("fullName", user.getFullName());
        node.put("password", user.getPassword());
        return node;
    }

    public static ArrayNode returnListMinUser(List<User> users) {
        ArrayNode node = MAPPER.createArrayNode();
        for (User user : users) {
            node.add(returnMinUser(user));
        }
        return node;
    }

    public static ArrayNode returnListUser(List<User> users) {
        ArrayNode node = MAPPER.createArrayNode();
        for (User user : users) {
            node.add(returnUser(user));
        }
        return node;
    }

    public static ObjectNode returnListUser(List<User> users, int totalCount) {
        ObjectNode node = MAPPER.createObjectNode();
        node.set("result", returnListUser(users));
        node.put("totalCount", totalCount);
        return node;
    }

    public static ObjectNode returnCalendar(Meeting calendar) {
        ObjectNode node = MAPPER.createObjectNode();
        return node;
    }

    public static ArrayNode returnListCalendar(List<Meeting> calendars) {
        ArrayNode node = MAPPER.createArrayNode();
        for (Meeting calendar : calendars) {
            node.add(returnCalendar(calendar));
        }
        return node;
    }

    public static ObjectNode returnDepartment(Department department) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", department.getId());
        node.put("title", department.getTitle());
        return node;
    }

    public static ArrayNode returnListDepartment(List<Department> departments) {
        ArrayNode node = MAPPER.createArrayNode();
        for (Department department : departments) {
            node.add(returnDepartment(department));
        }
        return node;
    }

    public static ObjectNode returnPermission(Permission permission) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", permission.getId());
        node.put("status", permission.isStatus());
        node.put("apiEndPoint", permission.getApiEndPoint());
        node.put("httpMethod", permission.getHttpMethod());
        node.put("description", permission.getDescription());
        return node;
    }

    public static ArrayNode returnListPermission(List<Permission> permissions) {
        ArrayNode node = MAPPER.createArrayNode();
        for (Permission permission : permissions) {
            node.add(returnPermission(permission));
        }
        return node;
    }

    public static ObjectNode returnBasePermission(BasePermission basePermission) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", basePermission.getId());
        node.put("apiEndPoint", basePermission.getApiEndPoint());
        node.put("httpMethod", basePermission.getHttpMethod());
        node.put("description", basePermission.getDescription());
        return node;
    }

    public static ArrayNode returnListBasePermission(List<BasePermission> basePermissions) {
        ArrayNode node = MAPPER.createArrayNode();
        for (BasePermission basePermission : basePermissions) {
            node.add(returnBasePermission(basePermission));
        }
        return node;
    }

    public static ObjectNode returnGroupPermission(GroupPermission groupPermission) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", groupPermission.getId());
        node.put("description", groupPermission.getDescription());
        node.put("defaultRole", groupPermission.isDefaultGroupPermission());
        node.set("permissions", returnListPermission(groupPermission.getPermissions()));
        node.put("status", groupPermission.isStatus());
        return node;
    }

    public static ArrayNode returnListGroupPermission(List<GroupPermission> groupPermissions) {
        ArrayNode node = MAPPER.createArrayNode();
        for (GroupPermission role : groupPermissions) {
            node.add(returnGroupPermission(role));
        }
        return node;
    }

    public static ObjectNode returnDocument(Document document) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", document.getId());
        node.put("title", document.getTitle());
        node.put("content", document.getContent());
        node.put("description", document.getDescription());
        node.put("thumbnail", document.getThumbnail());
        node.put("shortDescription", document.getShortDescription());
        node.put("username", document.getUsername());
        node.put("linkFile", document.getLinkFile());
        node.put("type", document.getType());
        node.put("status", document.isStatus());
        node.set("user", returnMinUser(document.getUser()));
        node.set("comments", returnListComment(document.getComments()));
        node.put("createdAt", document.getCreatedTime().toString());

        return node;
    }

    public static ArrayNode returnListDocument(List<Document> documents) {
        ArrayNode node = MAPPER.createArrayNode();
        for (Document document : documents) {
            node.add(returnDocument(document));
        }
        return node;
    }

    public static ObjectNode returnListDocument(List<Document> documents, int totalCount) {
        ObjectNode node = MAPPER.createObjectNode();
        node.set("result", returnListDocument(documents));
        node.put("totalCount", totalCount);
        return node;
    }

    public static ObjectNode returnComment(Comment comment) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", comment.getId());
        node.put("content", comment.getContent());
        node.put("createdAt", comment.getCreatedTime().toString());
        node.put("name", comment.getName());
        if (!comment.getChildren().isEmpty()) {
            node.set("reply", returnListComment(comment.getChildren()));
        }
        return node;
    }

    public static ArrayNode returnListComment(List<Comment> comments) {
        ArrayNode node = MAPPER.createArrayNode();
        for (Comment comment : comments) {
            node.add(returnComment(comment));
        }
        return node;
    }

    public static ObjectNode returnMeeting(Meeting meeting) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put("id", meeting.getId());
        node.put("time", meeting.getTime());
        node.put("place", meeting.getPlace());
        node.put("type", meeting.getType());
        node.put("topic", meeting.getTopic());
        node.put("notes", meeting.getNotes());
        node.put("status", meeting.isStatus());
        node.put("start", meeting.getStart());
        node.put("end", meeting.getEnd());
        node.set("creater", returnMinUser(meeting.getCreater()));
        node.set("inviter", returnMinUser(meeting.getInviter()));
        return node;
    }

    public static ArrayNode returnListMeeting(List<Meeting> meetings) {
        ArrayNode node = MAPPER.createArrayNode();
        for (Meeting meeting : meetings) {
            node.add(returnMeeting(meeting));
        }
        return node;
    }

}
