package Final.Year.Project.bmv.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WhatsAppMessageRequest {

    private String messaging_product = "whatsapp";
    private String to;
    private String type = "template";
    private Template template;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Template {
        private String name;
        private Language language;
        private List<Component> components;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Language {
        private String code = "en_US";
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Component {
        private String type = "body";
        private List<Parameter> parameters;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Parameter {
        private String type = "text";
        private String text;
    }
}

