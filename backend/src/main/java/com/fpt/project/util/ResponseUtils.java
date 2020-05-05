/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.util;

/**
 *
 * @author Phong
 */
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import static com.fpt.project.config.InfoConfig.MAPPER;
import com.fpt.project.constant.ErrorCode;
import com.fpt.project.constant.StatusCode;
import org.springframework.beans.factory.config.*;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.*;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class ResponseUtils {

    public static String OAuthError() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.OAUTH.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.OAUTH.name());
        return node.toString();
    }

    public static String PermissionDeny() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.PERMISSION_DENY.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.PERMISSION_DENY.name());
        return node.toString();
    }

    public static String NotFound() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.NOT_FOUND.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.NOT_FOUND.name());
        return node.toString();
    }

    public static String ServerError() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.SERVER_ERROR.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.SERVER_ERROR.name());
        return node.toString();
    }

    public static String success(StatusCode code, JsonNode body) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.NONE.getValue());
        node.put(StatusCode.class.getSimpleName(), code.getValue());
        if (body.isArray()) {
            ObjectNode nodeChild = MAPPER.createObjectNode();
            nodeChild.set("result", body);
            node.set("Response", nodeChild);
        } else {
            node.set("Response", body);
        }
        return node.toString();
    }

    public static String success(StatusCode code) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.NONE.getValue());
        node.put(StatusCode.class.getSimpleName(), code.getValue());
        node.put("Response", org.apache.commons.lang3.StringUtils.EMPTY);
        return node.toString();
    }

    public static String invalid() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.PARAMETER_INVALID.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.PARAMETER_INVALID.name());
        return node.toString();
    }

    public static String duplicate() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.DUPLICATE.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", "DUPLICATED");
        return node.toString();
    }

    public static String duplicate(String message) {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.DUPLICATE.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", message + " DUPLICATED");
        return node.toString();
    }

    public static String reachLimit() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.REACH_LIMITATION.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.REACH_LIMITATION.name());
        return node.toString();
    }

    public static String accountLocked() {
        ObjectNode node = MAPPER.createObjectNode();
        node.put(ErrorCode.class.getSimpleName(), ErrorCode.LOCKED.getValue());
        node.put(StatusCode.class.getSimpleName(), StatusCode.SUCCESS.getValue());
        node.put("Response", ErrorCode.LOCKED.name());
        return node.toString();
    }
}
