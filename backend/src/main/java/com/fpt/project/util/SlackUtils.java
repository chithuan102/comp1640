/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.util;

import static com.fpt.project.config.InfoConfig.WEBHOOK;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import net.gpedro.integrations.slack.SlackApi;
import net.gpedro.integrations.slack.SlackMessage;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author Phong
 */
public class SlackUtils {

    static {
        try {
            slackAPI = new SlackApi(WEBHOOK);
        } catch (Exception ex) {
            slackAPI = new SlackApi("");
        }

        msgQueue = new LinkedBlockingQueue<>();
        new Thread(new Runnable() {

            @Override
            public void run() {
                while (isLogging) {
                    try {
                        SlackMessage msg = msgQueue.take();
                        if (slackAPI != null) {
                            slackAPI.call(msg);
                        }

                    } catch (Exception ex) {

                    }
                }
            }
        }).start();
    }

    public static boolean isLogging = true;
    private static BlockingQueue<SlackMessage> msgQueue;
    private static SlackApi slackAPI;

    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";

    public static void sendMessage(String tag, String msg) {
        SlackMessage slackMsg = new SlackMessage(tag, String.format("%s : %s", DateTimeUtils.getNow(DATE_TIME_FORMAT), msg));
        msgQueue.add(slackMsg);
    }

    public static void stopLogging() {
        isLogging = false;
        msgQueue.add(new SlackMessage(StringUtils.EMPTY, "STOP"));
    }
}
