package com.madhukar.upisplitter.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class PaymentSplitter {

    private PaymentSplitter() {}

    public static List<BigDecimal> split(BigDecimal total, BigDecimal max) {

        if (total == null || max == null ||
            total.signum() <= 0 || max.signum() <= 0) {
            throw new IllegalArgumentException(
                "Amounts must be greater than zero"
            );
        }

        List<BigDecimal> out = new ArrayList<>();
        BigDecimal r = total;

        while (r.signum() > 0) {
            BigDecimal a = r.min(max);
            out.add(a);
            r = r.subtract(a);
        }

        return out;
    }
}