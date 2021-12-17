-brand-name = Super Project

welcome =
  Welcome, {$name}, to the {-brand-name}!
  Your balance is: {
    NUMBER($value, maximumFractionDigits: 2)
  }
  You have { NUMBER($applesCount) ->
    [0] no apples
    [one] {$applesCount} apple
    *[other] {$applesCount} apples
  }
