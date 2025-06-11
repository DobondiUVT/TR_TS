(base) burundi@Davids-Macbook problems % ts-node 7.12.ts
Starting completion with 3 initial rules.

--- Iteration 1 ---
Found 3 critical pairs. Current rules: 3
New rule added: i(x) * (x * z) -> z

--- Iteration 2 ---
Found 8 critical pairs. Current rules: 4
Rule too complex (complexity 10), skipping: i(x * y) * (x * (y * z)) -> z
New rule added: i(i(x)) * 1 -> x

--- Iteration 3 ---
Found 10 critical pairs. Current rules: 5
New rule added: i(i(x)) * z -> x * z

--- Iteration 4 ---
Found 17 critical pairs. Current rules: 6
New rule added: i(1) -> 1

--- Iteration 5 ---
Found 20 critical pairs. Current rules: 7
New rule added: x * i(x) -> 1

--- Iteration 6 ---
Found 26 critical pairs. Current rules: 8
New rule added: x * (y * i(x * y)) -> 1

--- Iteration 7 ---
Found 44 critical pairs. Current rules: 9
New rule added: x * (i(x) * z) -> z

--- Iteration 8 ---
Found 56 critical pairs. Current rules: 10
Rule too complex (complexity 12), skipping: x * (y * (y * i(x * (y * y)))) -> 1
Rule too complex (complexity 10), skipping: x * (y * (i(x * y) * z)) -> z
Rule too complex (complexity 10), skipping: x * (y * (i(x * y) * z)) -> z
New rule added: i(i(x)) -> x

--- Iteration 9 ---
Found 49 critical pairs. Current rules: 10
New rule added: y * i(x * y) -> i(x)

--- Iteration 10 ---
Found 44 critical pairs. Current rules: 10
Rule too complex (complexity 10), skipping: x * (y * i(x * (x * y))) -> i(x)
New rule added: y * (i(x * y) * z) -> i(x) * z

--- Iteration 11 ---
Found 66 critical pairs. Current rules: 11
Rule too complex (complexity 12), skipping: x * (y * (i(x * (x * y)) * z)) -> i(x) * z
New rule added: i(y) * i(x) -> i(x * y)

--- Iteration 12 ---
Found 78 critical pairs. Current rules: 12
New rule added: i(y) * (i(x) * z) -> i(x * y) * z

--- Iteration 13 ---
Found 99 critical pairs. Current rules: 13
New rule added: z * i(x * (y * z)) -> i(x * y)

--- Iteration 14 ---
Found 127 critical pairs. Current rules: 14
Rule too complex (complexity 12), skipping: x * (y * i(x * (y * (x * y)))) -> i(x * y)
Rule too complex (complexity 10), skipping: z * (i(x * (y * z)) * z) -> i(x * y) * z
New rule added: i(x * (y * i(x))) -> x * i(x * y)

--- Iteration 15 ---
Found 153 critical pairs. Current rules: 15
Rule too complex (complexity 13), skipping: x * (i(x * y) * (x * (y * i(x)))) -> 1
Rule too complex (complexity 15), skipping: x * (i(x * y) * (x * (y * (i(x) * z)))) -> z
New rule added: i(x * i(x * y)) -> x * (y * i(x))

--- Iteration 16 ---
Found 183 critical pairs. Current rules: 16
New rule added: i(i(x * y) * x) -> y

--- Iteration 17 ---
Found 215 critical pairs. Current rules: 17
Rule too complex (complexity 10), skipping: i(x * y) * (x * (y * z)) -> z
New rule added: i(x * y) * x -> i(y)

--- Iteration 18 ---
Found 211 critical pairs. Current rules: 17
New rule added: i(x * y) * (x * z) -> i(y) * z

--- Iteration 19 ---
Found 251 critical pairs. Current rules: 18
New rule added: i(x * i(y)) -> y * i(x)

--- Iteration 20 ---
Found 240 critical pairs. Current rules: 18
Rule too complex (complexity 10), skipping: y * (i(x * (x * y)) * z) -> i(x * x) * z
New rule added: i(i(x) * y) -> i(y) * x

--- Iteration 21 ---
Found 269 critical pairs. Current rules: 19
Rule too complex (complexity 9), skipping: i(x * (x * (y * i(x)))) -> x * i(x * (x * y))
Rule too complex (complexity 9), skipping: i(x * (y * (i(x) * y))) -> i(y) * (x * i(x * y))
Rule too complex (complexity 11), skipping: i(x * (x * (y * i(x)))) * z -> x * (i(x * (x * y)) * z)
Rule too complex (complexity 11), skipping: i(x * (y * (i(x) * y))) * z -> i(y) * (x * (i(x * y) * z))
Rule too complex (complexity 9), skipping: i(x * (x * i(y))) * z -> y * (i(x * x) * z)
Rule too complex (complexity 10), skipping: z * i(x * (y * (y * z))) -> i(x * (y * y))
Rule too complex (complexity 10), skipping: z * i(x * (x * (y * z))) -> i(x * (x * y))
Rule too complex (complexity 9), skipping: i(x * (x * (y * i(x)))) -> x * i(x * (x * y))
Rule too complex (complexity 16), skipping: i(x * (y * (i(x) * (y * (x * i(x * y)))))) -> x * (y * i(x * (y * (i(x) * (y * x)))))
Rule too complex (complexity 9), skipping: i(x * (x * i(x * y))) -> x * (y * i(x * x))
New rule added: i(x * (i(y) * x)) -> i(x) * (y * i(x))

--- Iteration 22 ---
Found 312 critical pairs. Current rules: 20
Rule too complex (complexity 9), skipping: i(x * (x * (i(y) * x))) -> i(x) * (y * i(x * x))
Rule too complex (complexity 9), skipping: i(x * (i(y) * (x * y))) -> i(x * y) * (y * i(x))
Rule too complex (complexity 11), skipping: i(x * (x * (i(y) * x))) * z -> i(x) * (y * (i(x * x) * z))
Rule too complex (complexity 11), skipping: i(x * (i(y) * (x * y))) * z -> i(x * y) * (y * (i(x) * z))
Rule too complex (complexity 17), skipping: i(x * (i(y) * (x * (y * (i(x) * (y * i(x))))))) -> x * (i(y) * (x * i(x * (i(y) * (x * y)))))
Rule too complex (complexity 9), skipping: i(x * (i(x * y) * y)) -> i(y) * (x * (y * i(x)))
Rule too complex (complexity 9), skipping: i(x * (z * (i(y) * z))) -> i(z) * (y * i(x * z))
Rule too complex (complexity 9), skipping: i(x * (i(y) * (x * x))) -> i(x * x) * (y * i(x))
No new rules generated from critical pairs. Completion finished.

Completion successful after 22 iterations
Final rule set contains 20 rules

--- Checking System Coverage ---
Rule (x * y) * z -> x * (y * z) ✅
Rule 1 * x -> x ✅
Rule x * 1 -> x ✅
Rule x * i(x) -> 1 ✅
Rule i(x) * x -> 1 ✅
Rule i(1) -> 1 ✅
Rule i(i(x)) -> x ✅
Rule i(x * y) -> i(y) * i(x) ✅
Rule x * (i(x) * y) -> y ✅
Rule i(x) * (x * y) -> y ✅

Successfully wrote the completed system to completed_system_E.txt
Starting completion with 3 initial rules.

--- Iteration 1 ---
Found 5 critical pairs. Current rules: 3
New rule added: x * (y * i(x * y)) -> 1

--- Iteration 2 ---
Found 14 critical pairs. Current rules: 4
New rule added: x * (i(x) * z) -> z

--- Iteration 3 ---
Found 22 critical pairs. Current rules: 5
Rule too complex (complexity 12), skipping: x * (y * (y * i(x * (y * y)))) -> 1
Rule too complex (complexity 10), skipping: x * (y * (i(x * y) * z)) -> z
Rule too complex (complexity 10), skipping: x * (y * (i(x * y) * z)) -> z
New rule added: i(1) -> 1

--- Iteration 4 ---
Found 24 critical pairs. Current rules: 6
Rule too complex (complexity 12), skipping: x * (x * (y * i(x * (x * y)))) -> 1
Rule too complex (complexity 12), skipping: x * (y * (z * i(x * (y * z)))) -> 1
New rule added: x * i(x * 1) -> 1

--- Iteration 5 ---
Found 32 critical pairs. Current rules: 7
Rule too complex (complexity 10), skipping: x * (y * i(x * (y * 1))) -> 1
New rule added: x * (i(x * 1) * z) -> z

--- Iteration 6 ---
Found 45 critical pairs. Current rules: 8
Rule too complex (complexity 12), skipping: x * (y * (i(x * (y * 1)) * z)) -> z
Rule too complex (complexity 10), skipping: x * (y * (i(x * y) * 1)) -> 1
New rule added: i(i(x)) -> x * 1

--- Iteration 7 ---
Found 49 critical pairs. Current rules: 9
New rule added: i(x) * (x * 1) -> 1

--- Iteration 8 ---
Found 56 critical pairs. Current rules: 10
New rule added: i(x) * (x * z) -> z

--- Iteration 9 ---
Found 61 critical pairs. Current rules: 10
New rule added: i(i(x) * x) -> 1

--- Iteration 10 ---
Found 70 critical pairs. Current rules: 11
New rule added: y * i(i(x) * y) -> x * 1

--- Iteration 11 ---
Found 88 critical pairs. Current rules: 12
Rule too complex (complexity 9), skipping: y * (i(i(x) * y) * z) -> x * z
New rule added: i(i(x) * 1) -> x * 1

--- Iteration 12 ---
Found 103 critical pairs. Current rules: 13
Rule too complex (complexity 12), skipping: y * (i(i(x) * y) * i(x * 1)) -> 1
New rule added: i(i(x) * i(x)) -> x * (x * 1)

--- Iteration 13 ---
Found 122 critical pairs. Current rules: 14
Rule too complex (complexity 10), skipping: x * (y * i(x * (y * 1))) -> 1
Rule too complex (complexity 12), skipping: x * (y * (i(x * (y * 1)) * z)) -> z
New rule added: i(i(x) * i(x * 1)) -> x * (x * 1)

--- Iteration 14 ---
Found 143 critical pairs. Current rules: 15
Rule too complex (complexity 13), skipping: i(x) * (i(x * 1) * (x * (x * 1))) -> 1
Rule too complex (complexity 13), skipping: i(x) * (i(x * 1) * (x * (x * 1))) -> 1
Rule too complex (complexity 13), skipping: i(x) * (i(x * 1) * (x * (x * z))) -> z
New rule added: i(x * 1) -> i(x) * 1

--- Iteration 15 ---
Found 112 critical pairs. Current rules: 13
New rule added: i(x) * (i(x) * 1) -> i(x * (x * 1))

--- Iteration 16 ---
Found 105 critical pairs. Current rules: 13
New rule added: i(x * (x * 1)) * z -> i(x) * (i(x) * z)

--- Iteration 17 ---
Found 128 critical pairs. Current rules: 14
Rule too complex (complexity 12), skipping: i(x) * i(x * i(x * (x * 1))) -> 1
Rule too complex (complexity 16), skipping: i(x) * (i(x) * (z * i(i(x) * (i(x) * z)))) -> 1
New rule added: x * i(x * (x * 1)) -> i(x) * 1

--- Iteration 18 ---
Found 143 critical pairs. Current rules: 15
Rule too complex (complexity 14), skipping: x * (y * i(x * (y * (x * (y * 1))))) -> i(x * y) * 1
Rule too complex (complexity 10), skipping: i(x * y) * (x * (y * z)) -> z
New rule added: i(x) * 1 -> i(x)

--- Iteration 19 ---
Found 111 critical pairs. Current rules: 14
New rule added: y * i(x * y) -> i(x)

--- Iteration 20 ---
Found 84 critical pairs. Current rules: 13
Rule too complex (complexity 10), skipping: x * (y * i(x * (x * y))) -> i(x)
New rule added: y * (i(x * y) * z) -> i(x) * z

--- Iteration 21 ---
Found 108 critical pairs. Current rules: 14
Rule too complex (complexity 12), skipping: x * (y * (i(x * (x * y)) * z)) -> i(x) * z
New rule added: i(y) * i(x) -> i(x * y)

--- Iteration 22 ---
Found 105 critical pairs. Current rules: 14
New rule added: i(y) * (i(x) * z) -> i(x * y) * z

--- Iteration 23 ---
Found 132 critical pairs. Current rules: 15
Rule too complex (complexity 10), skipping: i(x * x) * (x * (x * z)) -> z
Rule too complex (complexity 11), skipping: i(i(x * x) * (x * (x * 1))) -> 1
Rule too complex (complexity 10), skipping: i(x * (y * (x * (y * 1)))) -> i(x * (y * (x * y)))
Rule too complex (complexity 10), skipping: i(x * (y * (x * (y * 1)))) -> i(x * (y * (x * y)))
New rule added: z * i(x * (y * z)) -> i(x * y)

--- Iteration 24 ---
Found 159 critical pairs. Current rules: 16
Rule too complex (complexity 12), skipping: x * (y * i(x * (y * (x * y)))) -> i(x * y)
Rule too complex (complexity 10), skipping: z * (i(x * (y * z)) * z) -> i(x * y) * z
New rule added: i(x * (y * i(x))) -> x * i(x * y)

--- Iteration 25 ---
Found 189 critical pairs. Current rules: 17
New rule added: i(x * i(x * y)) -> x * (y * i(x))

--- Iteration 26 ---
Found 221 critical pairs. Current rules: 18
Rule too complex (complexity 13), skipping: x * (i(x * y) * (x * (y * i(x)))) -> 1
Rule too complex (complexity 15), skipping: x * (i(x * y) * (x * (y * (i(x) * z)))) -> z
Rule too complex (complexity 14), skipping: i(x * (i(x * y) * (x * (y * i(x))))) -> 1
New rule added: i(x * (i(y) * y)) -> i(x)

--- Iteration 27 ---
Found 255 critical pairs. Current rules: 19
New rule added: i(i(x * y) * x) -> y * 1

--- Iteration 28 ---
Found 292 critical pairs. Current rules: 20
Rule too complex (complexity 10), skipping: i(x * y) * (x * (y * 1)) -> 1
Rule too complex (complexity 10), skipping: i(x * y) * (x * (y * z)) -> z
New rule added: i(x * y) * (x * 1) -> i(y)

--- Iteration 29 ---
Found 329 critical pairs. Current rules: 21
New rule added: i(x * y) * (x * z) -> i(y) * z

--- Iteration 30 ---
Found 335 critical pairs. Current rules: 21
Rule too complex (complexity 9), skipping: i(x * (i(x * y) * x)) -> y * i(x)
Rule too complex (complexity 11), skipping: i(x * (i(x * y) * x)) * z -> y * (i(x) * z)
Rule too complex (complexity 10), skipping: y * (i(x * (x * y)) * z) -> i(x * x) * z
New rule added: i(i(x) * y) -> i(y) * (x * 1)

--- Iteration 31 ---
Found 304 critical pairs. Current rules: 20
New rule added: i(x * (x * (x * 1))) -> i(x * (x * x))

--- Iteration 32 ---
Found 327 critical pairs. Current rules: 21
Rule too complex (complexity 14), skipping: x * (x * (x * (i(x * (x * x)) * z))) -> z
Rule too complex (complexity 12), skipping: x * (x * (i(x * (x * x)) * z)) -> i(x) * z
Rule too complex (complexity 9), skipping: i(x * (x * (y * i(x)))) -> x * i(x * (x * y))
Rule too complex (complexity 9), skipping: i(x * (y * (i(x) * y))) -> i(y) * (x * i(x * y))
Rule too complex (complexity 9), skipping: i(x * (x * i(x * y))) -> x * (y * i(x * x))
Rule too complex (complexity 9), skipping: i(x * (i(x * y) * y)) -> i(y) * (x * (y * i(x)))
Rule too complex (complexity 9), skipping: i(x * (x * (i(y) * y))) -> i(x * x)
Rule too complex (complexity 10), skipping: i(x * (x * (x * (x * 1)))) -> i(x * (x * (x * x)))
Rule too complex (complexity 11), skipping: i(x * (x * (y * i(x)))) * z -> x * (i(x * (x * y)) * z)
Rule too complex (complexity 11), skipping: i(x * (y * (i(x) * y))) * z -> i(y) * (x * (i(x * y) * z))
Rule too complex (complexity 11), skipping: i(x * (x * i(x * y))) * z -> x * (y * (i(x * x) * z))
Rule too complex (complexity 11), skipping: i(x * (i(x * y) * y)) * z -> i(y) * (x * (y * (i(x) * z)))
Rule too complex (complexity 11), skipping: i(x * (x * (i(y) * y))) * z -> i(x * x) * z
Rule too complex (complexity 12), skipping: i(x * (x * (x * (x * 1)))) * z -> i(x * (x * (x * x))) * z
Rule too complex (complexity 10), skipping: z * i(x * (y * (y * z))) -> i(x * (y * y))
Rule too complex (complexity 10), skipping: z * i(x * (x * (y * z))) -> i(x * (x * y))
Rule too complex (complexity 9), skipping: i(x * (i(x * y) * x)) -> i(x * i(y))
Rule too complex (complexity 9), skipping: i(x * (i(x * y) * x)) -> i(x * i(y))
New rule added: i(x * i(y)) -> y * i(x)

--- Iteration 33 ---
Found 316 critical pairs. Current rules: 21
Rule too complex (complexity 9), skipping: i(x * (x * i(y))) * z -> y * (i(x * x) * z)
Rule too complex (complexity 9), skipping: i(x * (x * (y * i(x)))) -> x * i(x * (x * y))
Rule too complex (complexity 10), skipping: i(y * (x * 1)) * (x * 1) -> i(y * x) * (x * 1)
Rule too complex (complexity 11), skipping: i(x * (x * (y * i(x * x)))) -> x * (x * i(x * (x * y)))
Rule too complex (complexity 16), skipping: i(x * (y * (i(x) * (y * (x * i(x * y)))))) -> x * (y * i(x * (y * (i(x) * (y * x)))))
Rule too complex (complexity 10), skipping: i(y * (x * 1)) * (x * 1) -> i(y * x) * (x * 1)
Rule too complex (complexity 15), skipping: i(x * (x * (x * (y * i(x * (x * x)))))) -> x * (x * (x * i(x * (x * (x * y)))))
Rule too complex (complexity 9), skipping: i(x * (i(x * y) * y)) -> i(y) * (x * (y * i(x)))
New rule added: i(y * (i(x) * y)) -> i(y) * (x * i(y))

--- Iteration 34 ---
Found 363 critical pairs. Current rules: 22
Rule too complex (complexity 9), skipping: i(x * (y * (i(x) * y))) -> i(y) * (x * i(x * y))
Rule too complex (complexity 9), skipping: i(y * (i(x) * (y * y))) -> i(y * y) * (x * i(y))
Rule too complex (complexity 11), skipping: i(x * (y * (i(x) * y))) * z -> i(y) * (x * (i(x * y) * z))
Rule too complex (complexity 11), skipping: i(y * (i(x) * (y * y))) * z -> i(y * y) * (x * (i(y) * z))
Rule too complex (complexity 12), skipping: i(y * (i(x) * (y * (x * i(y))))) -> y * i(y * (i(x) * (y * x)))
Rule too complex (complexity 14), skipping: i(x * (y * (x * (y * (x * (y * 1)))))) -> i(x * (y * (x * (y * (x * y)))))
Rule too complex (complexity 14), skipping: i(x * (y * (x * (y * (x * (y * 1)))))) -> i(x * (y * (x * (y * (x * y)))))
Rule too complex (complexity 14), skipping: i(x * (y * (x * (y * (x * (y * 1)))))) -> i(x * (y * (x * (y * (x * y)))))
Rule too complex (complexity 9), skipping: i(x * (x * i(x * y))) -> x * (y * i(x * x))
Rule too complex (complexity 9), skipping: i(x * (i(y) * (x * 1))) -> i(x) * (y * i(x))
Rule too complex (complexity 10), skipping: i(x * (i(y) * (x * i(y)))) -> y * (i(x) * (y * i(x)))
Rule too complex (complexity 11), skipping: i(y * (x * (i(x * y) * y))) -> i(y) * (x * (y * i(y * x)))
Rule too complex (complexity 9), skipping: i(x * (z * (i(y) * z))) -> i(z) * (y * i(x * z))
Rule too complex (complexity 9), skipping: i(y * (y * (i(x) * y))) -> i(y) * (x * i(y * y))
No new rules generated from critical pairs. Completion finished.

Completion successful after 34 iterations
Final rule set contains 22 rules

--- Checking System Coverage ---
Rule (x * y) * z -> x * (y * z) ✅
Rule 1 * x -> x ✅
Rule x * 1 -> x ❌
Rule x * i(x) -> 1 ✅
Rule i(x) * x -> 1 ❌
Rule i(1) -> 1 ✅
Rule i(i(x)) -> x ❌
Rule i(x * y) -> i(y) * i(x) ✅
Rule x * (i(x) * y) -> y ✅
Rule i(x) * (x * y) -> y ✅

Successfully wrote the completed system to completed_system_E_prime.txt
(base) burundi@Davids-Macbook problems % 