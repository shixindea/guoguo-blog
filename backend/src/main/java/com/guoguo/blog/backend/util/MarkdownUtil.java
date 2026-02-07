package com.guoguo.blog.backend.util;

import com.vladsch.flexmark.ext.autolink.AutolinkExtension;
import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension;
import com.vladsch.flexmark.ext.tables.TablesExtension;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.util.data.MutableDataSet;
import java.util.List;

public final class MarkdownUtil {
  private static final Parser PARSER;
  private static final HtmlRenderer RENDERER;

  static {
    MutableDataSet options = new MutableDataSet();
    options.set(Parser.EXTENSIONS, List.of(TablesExtension.create(), StrikethroughExtension.create(), AutolinkExtension.create()));
    PARSER = Parser.builder(options).build();
    RENDERER = HtmlRenderer.builder(options).build();
  }

  private MarkdownUtil() {}

  public static String toHtml(String markdown) {
    if (markdown == null) {
      return null;
    }
    return RENDERER.render(PARSER.parse(markdown));
  }

  public static String extractSummary(String markdown, int length) {
    if (markdown == null || markdown.isBlank() || length <= 0) {
      return "";
    }
    String text = markdown.replaceAll("```[\\s\\S]*?```", "").replaceAll("[#>*_`\\-]", " ").replaceAll("\\s+", " ").trim();
    if (text.length() <= length) {
      return text;
    }
    return text.substring(0, length);
  }
}

