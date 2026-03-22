import { useMemo, useState } from 'react';
import {
  createEmptyLifecycle,
  factSheetSubtypes,
  factSheetTypes,
  lifecyclePhases,
  requiresTimeModel,
  timeModelOptions
} from '@ea-tool/shared';

const defaultType = factSheetTypes[0];
const defaultSubtype = factSheetSubtypes[defaultType]?.[0] || '';

const initialState = {
  type: defaultType,
  subtype: defaultSubtype,
  name: '',
  description: '',
  timeModel: 'Tolerate',
  lifecycle: createEmptyLifecycle(),
  owner: '',
  tags: '',
  attributes: '{\n  "vendor": "",\n  "criticality": ""\n}'
};

export default function FactSheetForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const subtypeOptions = useMemo(() => factSheetSubtypes[form.type] || [], [form.type]);
  const showTimeModel = requiresTimeModel(form.type);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => {
      if (name === 'type') {
        return {
          ...current,
          type: value,
          subtype: factSheetSubtypes[value]?.[0] || '',
          timeModel: requiresTimeModel(value) ? current.timeModel : 'Tolerate'
        };
      }

      return { ...current, [name]: value };
    });
  }

  function updateLifecycleField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      lifecycle: {
        ...current.lifecycle,
        [name]: value
      }
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('saving');
    setError('');

    try {
      const response = await fetch('/api/factsheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          timeModel: showTimeModel ? form.timeModel : null,
          tags: form.tags
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          attributes: JSON.parse(form.attributes)
        })
      });

      if (!response.ok) {
        throw new Error('Unable to create fact sheet.');
      }

      const created = await response.json();
      setForm(initialState);
      onCreated(created);
      setStatus('saved');
    } catch (submitError) {
      setStatus('error');
      setError(submitError.message);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Create Fact Sheet</h2>
        <span className={`badge badge-${status}`}>{status}</span>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Type
          <select name="type" value={form.type} onChange={updateField}>
            {factSheetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subtype
          <select name="subtype" value={form.subtype} onChange={updateField}>
            {subtypeOptions.map((subtype) => (
              <option key={subtype} value={subtype}>
                {subtype}
              </option>
            ))}
          </select>
        </label>

        <label>
          Name
          <input name="name" value={form.name} onChange={updateField} placeholder="Payments API" required />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={updateField} rows="3" />
        </label>

        {showTimeModel ? (
          <label>
            TIME Model
            <select name="timeModel" value={form.timeModel} onChange={updateField}>
              {timeModelOptions.map((timeModel) => (
                <option key={timeModel} value={timeModel}>
                  {timeModel}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <fieldset>
          <legend>Lifecycle Timeline</legend>
          <div className="stack">
            {lifecyclePhases.map((phase) => (
              <label key={phase.key}>
                {phase.label}
                <input
                  type="date"
                  name={phase.key}
                  value={form.lifecycle[phase.key]}
                  onChange={updateLifecycleField}
                  required
                />
              </label>
            ))}
          </div>
        </fieldset>

        <label>
          Owner
          <input name="owner" value={form.owner} onChange={updateField} placeholder="Integration Team" />
        </label>

        <label>
          Tags
          <input name="tags" value={form.tags} onChange={updateField} placeholder="integration, api" />
        </label>

        <label>
          Attributes (JSON)
          <textarea name="attributes" value={form.attributes} onChange={updateField} rows="5" />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit">Save Fact Sheet</button>
      </form>
    </section>
  );
}
