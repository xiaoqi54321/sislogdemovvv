package com.dzt.demo.service;


import java.util.List;
import java.util.Map;

public interface SyslogService {

    List<Map<String, Object>> queryData();

    Map<String, Object> list() throws Exception;
}
