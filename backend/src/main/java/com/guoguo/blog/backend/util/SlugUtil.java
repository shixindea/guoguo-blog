package com.guoguo.blog.backend.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {
  private SlugUtil() {}

  public static String toSlug(String input) {
    if (input == null) {
      return null;
    }
    String normalized = Normalizer.normalize(input, Normalizer.Form.NFKD);
    String slug =
        normalized
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9\\s-]", "")
            .trim()
            .replaceAll("\\s+", "-")
            .replaceAll("-{2,}", "-");
    if (slug.isBlank()) {
      return "article";
    }
    return slug;
  }
}

