import FilterGroup from "./FilterGroup";
import RangeSlider from "./RangeSlider";
import CheckboxList from "./CheckboxList";
import TagSelect from "./TagSelect";

const ATTRIBUTE_LABELS = {
  category: "Категорії",
  city: "Міста",
  price: "Ціна",
  mileage: "Пробіг",
  area: "Площа",
  condition: "Стан",
  status: "Статус",
  isOriginal: "Тільки оригінал",
  isVerified: "Перевірені продавці",
  deliveryAvailable: "Доставка",
  isPromoted: "Преміум-оголошення",
};

const QUICK_BOOLEAN_FILTERS = [
  "isOriginal",
  "isVerified",
  "deliveryAvailable",
  "isPromoted",
];

const RANGE_FILTERS = {
  price: { min: 0, max: 200000, step: 100, unit: "₴" },
  mileage: { min: 0, max: 500000, step: 1000, unit: "км" },
  area: { min: 0, max: 1000, step: 5, unit: "м²" },
};

const CONDITION_LABELS = {
  new: "Новий",
  used_like_new: "Б/в як новий",
  used_minor: "Б/в з нюансами",
  used_with_issues: "Б/в з дефектами",
};

const STATUS_LABELS = {
  active: "Активні",
  draft: "Чернетки",
  archived: "Архів",
};

function mapFacetOption(attribute, value, count) {
  const stringValue = String(value);
  let label = stringValue;

  switch (attribute) {
    case "condition":
      label = CONDITION_LABELS[stringValue] || "Інший стан";
      break;
    case "status":
      label = STATUS_LABELS[stringValue] || stringValue;
      break;
    default:
      label = stringValue;
  }

  if (attribute === "price" || attribute === "mileage" || attribute === "area") {
    const numeric = Number(stringValue);
    if (!Number.isNaN(numeric)) {
      label = numeric.toLocaleString("uk-UA");
    }
  }

  return { value: stringValue, label, count };
}

function getFacetOptions(attribute, facet = {}) {
  return Object.entries(facet)
    .map(([value, count]) => mapFacetOption(attribute, value, count))
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
}

function getNumericBounds(facet = {}, defaults) {
  const numericValues = Object.keys(facet)
    .map((value) => Number(value))
    .filter((num) => !Number.isNaN(num));

  if (!numericValues.length) return defaults;

  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
    step: defaults?.step ?? 1,
    unit: defaults?.unit,
  };
}

function getBooleanFacetCount(facet = {}) {
  const trueKey = Object.keys(facet).find(
    (key) => key === true || key === "true" || key === "1" || key === "True"
  );
  if (!trueKey) return 0;
  return facet[trueKey];
}

export default function FilterSidebar({
  filters,
  facets = {},
  onFilterChange,
  onReset,
  onClose,
  isMobile = false,
}) {
  const selectedFilters = filters ?? {};

  const booleanQuickOptions = QUICK_BOOLEAN_FILTERS.map((attribute) => {
    const facet = facets?.[attribute];
    if (!facet) return null;
    const count = getBooleanFacetCount(facet);
    if (!count) return null;

    return {
      id: `${attribute}:true`,
      attribute,
      value: "true",
      label: ATTRIBUTE_LABELS[attribute] ?? attribute,
      count,
    };
  }).filter(Boolean);

  const selectedBooleanQuick = booleanQuickOptions
    .filter((option) => {
      const currentValue = selectedFilters[option.attribute];
      if (Array.isArray(currentValue)) {
        return currentValue.includes(option.value);
      }
      if (typeof currentValue === "boolean") {
        return currentValue === true && option.value === "true";
      }
      if (currentValue === undefined || currentValue === null) return false;
      return String(currentValue) === option.value;
    })
    .map((option) => option.id);

  const categoryFacet = facets?.category;
  const categoryOptions = getFacetOptions("category", categoryFacet);
  const selectedCategories = Array.isArray(selectedFilters.category)
    ? selectedFilters.category
    : [];
  const categoryTagOptions = categoryOptions.slice(0, 6).map((option) => ({
    ...option,
    id: `category:${option.value}`,
    attribute: "category",
  }));
  const selectedCategoryTags = categoryTagOptions
    .filter((option) => selectedCategories.includes(option.value))
    .map((option) => option.id);

  const rangeGroups = Object.entries(RANGE_FILTERS).map(([attribute, defaults]) => {
    const stats = getNumericBounds(facets?.[attribute], defaults);
    return {
      attribute,
      label: ATTRIBUTE_LABELS[attribute] ?? attribute,
      min: stats?.min ?? defaults.min,
      max: stats?.max ?? defaults.max,
      step: stats?.step ?? defaults.step,
      unit: stats?.unit,
    };
  });

  const handleRangeChange = (attribute) => (value) => {
    if (!onFilterChange) return;
    if (!value || (value.min === undefined && value.max === undefined)) {
      onFilterChange(attribute, undefined);
      return;
    }
    onFilterChange(attribute, value);
  };

  const handleCheckboxChange = (attribute) => (values) => {
    if (!onFilterChange) return;
    if (!values || !values.length) {
      onFilterChange(attribute, undefined);
      return;
    }
    onFilterChange(attribute, values);
  };

  const content = (
    <div className="flex h-full flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Фільтри</h2>
          <p className="text-sm text-neutral-500">Уточніть пошук за допомогою підказок</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onReset?.()}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
          >
            Скинути
          </button>
          {isMobile ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Готово
            </button>
          ) : null}
        </div>
      </header>

      {booleanQuickOptions.length ? (
        <FilterGroup title="Швидкі фільтри">
          <TagSelect
            options={booleanQuickOptions}
            selected={selectedBooleanQuick}
            onToggle={(option, willSelect) => {
              if (!onFilterChange) return;
              if (willSelect) {
                onFilterChange(option.attribute, option.value);
              } else {
                onFilterChange(option.attribute, undefined);
              }
            }}
          />
        </FilterGroup>
      ) : null}

      {categoryTagOptions.length ? (
        <FilterGroup title="Популярні категорії">
          <TagSelect
            options={categoryTagOptions}
            selected={selectedCategoryTags}
            onToggle={(option, willSelect) => {
              const current = Array.isArray(selectedFilters.category)
                ? selectedFilters.category
                : [];
              if (willSelect) {
                const next = Array.from(new Set([...current, option.value]));
                onFilterChange?.("category", next);
              } else {
                const next = current.filter((value) => value !== option.value);
                onFilterChange?.("category", next.length ? next : undefined);
              }
            }}
          />
        </FilterGroup>
      ) : null}

      {rangeGroups.map((group) => (
        <FilterGroup key={group.attribute} title={group.label}>
          <RangeSlider
            min={group.min}
            max={group.max}
            step={group.step}
            unit={group.unit}
            value={selectedFilters[group.attribute]}
            onChange={handleRangeChange(group.attribute)}
          />
        </FilterGroup>
      ))}

      {categoryOptions.length ? (
        <FilterGroup title={ATTRIBUTE_LABELS.category}>
          <CheckboxList
            options={categoryOptions.map((option) => ({
              ...option,
              value: option.value,
            }))}
            value={selectedCategories}
            onChange={handleCheckboxChange("category")}
          />
        </FilterGroup>
      ) : null}

      {(() => {
        const cityOptions = getFacetOptions("city", facets?.city);
        if (!cityOptions.length) return null;
        const selectedCities = Array.isArray(selectedFilters.city)
          ? selectedFilters.city
          : [];
        return (
          <FilterGroup title={ATTRIBUTE_LABELS.city}>
            <CheckboxList
              options={cityOptions}
              value={selectedCities}
              onChange={handleCheckboxChange("city")}
            />
          </FilterGroup>
        );
      })()}

      {(() => {
        const conditionOptions = getFacetOptions("condition", facets?.condition);
        if (!conditionOptions.length) return null;
        const selectedConditions = Array.isArray(selectedFilters.condition)
          ? selectedFilters.condition
          : [];
        return (
          <FilterGroup title={ATTRIBUTE_LABELS.condition}>
            <CheckboxList
              options={conditionOptions}
              value={selectedConditions}
              onChange={handleCheckboxChange("condition")}
            />
          </FilterGroup>
        );
      })()}

      {(() => {
        const statusOptions = getFacetOptions("status", facets?.status);
        if (!statusOptions.length) return null;
        const selectedStatuses = Array.isArray(selectedFilters.status)
          ? selectedFilters.status
          : [];
        return (
          <FilterGroup title={ATTRIBUTE_LABELS.status}>
            <CheckboxList
              options={statusOptions}
              value={selectedStatuses}
              onChange={handleCheckboxChange("status")}
            />
          </FilterGroup>
        );
      })()}
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-t-3xl bg-white p-6 shadow-xl">
        <div className="flex-1 overflow-y-auto pr-1">{content}</div>
      </div>
    );
  }

  return (
    <aside className="sticky top-28 h-fit w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      {content}
    </aside>
  );
}
