import { SetStateAction, SyntheticEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** ХУК УНИВЕРСАЛЬНОЙ ОБРАБОТКИ ФОРМ */
interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnSubmit?: boolean;
  resetOnSuccess?: boolean;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validateOnSubmit = false,
  resetOnSuccess = false
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Преобразуем submitError в правильный формат для UI-компонентов
  const errorText = submitError || undefined;

  // Сброс формы к начальным значениям
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);

  // Обработчик изменения полей
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value
      }));
      // Очищаем ошибку для этого поля при изменении
      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined
        }));
      }
    },
    [errors]
  );

  // Функция для обновления конкретного поля (с поддержкой SetStateAction)
  const updateField = useCallback(
    <K extends keyof T>(field: K, valueOrUpdater: SetStateAction<T[K]>) => {
      setValues((prev) => {
        const newValue =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (prev: T[K]) => T[K])(prev[field])
            : valueOrUpdater;

        // Если значение не изменилось, возвращаем тот же объект
        if (prev[field] === newValue) {
          return prev;
        }

        return {
          ...prev,
          [field]: newValue
        };
      });

      // Очищаем ошибку для этого поля при изменении
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined
        }));
      }
    },
    [errors]
  );

  // Создаем сеттеры для каждого поля формы
  const createFieldSetters = useCallback(() => {
    const setters: { [K in keyof T]: (value: SetStateAction<T[K]>) => void } =
      {} as { [K in keyof T]: (value: SetStateAction<T[K]>) => void };

    (Object.keys(initialValues) as Array<keyof T>).forEach((key) => {
      setters[key] = (value: SetStateAction<T[typeof key]>) =>
        updateField(key, value);
    });

    return setters;
  }, [initialValues, updateField]);

  // Обработчик отправки формы
  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setSubmitError(null);

      if (validateOnSubmit) {
        // Базовая валидация - проверка заполненности обязательных полей
        const newErrors: Partial<Record<keyof T, string>> = {};
        (Object.entries(values) as Array<[keyof T, unknown]>).forEach(
          ([key, value]) => {
            if (!value && key !== 'password') {
              // password может быть пустым в некоторых случаях
              newErrors[key] = 'Это поле обязательно для заполнения';
            }
          }
        );

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        if (resetOnSuccess) {
          resetForm();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Произошла ошибка';
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validateOnSubmit, resetOnSuccess, resetForm]
  );

  return {
    values,
    errors,
    isSubmitting,
    submitError: errorText,
    handleChange,
    handleSubmit,
    resetForm,
    updateField,
    createFieldSetters,
    setValues,
    navigate
  };
}
