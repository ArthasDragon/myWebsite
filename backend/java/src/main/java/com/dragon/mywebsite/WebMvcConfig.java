package com.dragon.mywebsite;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/mywebsite/**").addResourceLocations("classpath:/mywebsite/");

        //其他静态资源
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }
}
