;; julia.wat
;; Computa o conjunto de Julia e grava a contagem de iterações de cada pixel
;; como i32 little-endian em memória linear.
;; julia(ptr, w, h, cx, cy, maxIter)
(module
  (memory (export "memory") 6)

  (func (export "julia")
    (param $ptr i32) (param $w i32) (param $h i32)
    (param $cx f64) (param $cy f64) (param $maxIter i32)

    (local $x i32) (local $y i32) (local $i i32)
    (local $zx f64) (local $zy f64)
    (local $zx2 f64) (local $zy2 f64) (local $t f64)
    (local $scale f64) (local $hw f64) (local $hh f64)
    (local $out i32)

    (local.set $scale (f64.div (f64.const 3.2) (f64.convert_i32_s (local.get $w))))
    (local.set $hw (f64.mul (f64.convert_i32_s (local.get $w)) (f64.const 0.5)))
    (local.set $hh (f64.mul (f64.convert_i32_s (local.get $h)) (f64.const 0.5)))
    (local.set $y (i32.const 0))

    (block $endY
      (loop $loopY
        (br_if $endY (i32.ge_s (local.get $y) (local.get $h)))
        (local.set $x (i32.const 0))

        (block $endX
          (loop $loopX
            (br_if $endX (i32.ge_s (local.get $x) (local.get $w)))

            (local.set $zx
              (f64.mul
                (f64.sub (f64.convert_i32_s (local.get $x)) (local.get $hw))
                (local.get $scale)))
            (local.set $zy
              (f64.mul
                (f64.sub (f64.convert_i32_s (local.get $y)) (local.get $hh))
                (local.get $scale)))

            (local.set $i (i32.const 0))
            (block $endI
              (loop $loopI
                (br_if $endI (i32.ge_s (local.get $i) (local.get $maxIter)))
                (local.set $zx2 (f64.mul (local.get $zx) (local.get $zx)))
                (local.set $zy2 (f64.mul (local.get $zy) (local.get $zy)))
                (br_if $endI
                  (f64.gt (f64.add (local.get $zx2) (local.get $zy2)) (f64.const 4.0)))
                (local.set $t
                  (f64.add
                    (f64.sub (local.get $zx2) (local.get $zy2))
                    (local.get $cx)))
                (local.set $zy
                  (f64.add
                    (f64.mul (f64.const 2.0) (f64.mul (local.get $zx) (local.get $zy)))
                    (local.get $cy)))
                (local.set $zx (local.get $t))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $loopI)
              )
            )

            (local.set $out
              (i32.add
                (local.get $ptr)
                (i32.shl
                  (i32.add
                    (i32.mul (local.get $y) (local.get $w))
                    (local.get $x))
                  (i32.const 2))))
            (i32.store (local.get $out) (local.get $i))

            (local.set $x (i32.add (local.get $x) (i32.const 1)))
            (br $loopX)
          )
        )

        (local.set $y (i32.add (local.get $y) (i32.const 1)))
        (br $loopY)
      )
    )
  )
)
