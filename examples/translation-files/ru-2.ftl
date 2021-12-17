welcome =
  Добро пожаловать, {$name}, в {-brand-name}!
  У Вас на счету: {
    NUMBER($value, maximumFractionDigits: 2)
  }
  У вас { NUMBER($applesCount) ->
    [0] нет яблок
    [one] {$applesCount} яблоко
    [few] {$applesCount} яблока
    *[other] {$applesCount} яблок
  }
