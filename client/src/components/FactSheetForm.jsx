import { useMemo, useState } from 'react';
import { factSheetSubtypes, factSheetTypes } from '@ea-tool/shared';

const defaultType = factSheetTypes[0];
const defaultSubtype = factSheetSubtypes[defaultType]?.[0] || '';

const initialState = {
  type: defaultType,
  subtype: defaultSubtype,
  name: '',
  description: '',
  lifecycle: 'planned',
  owner: '',
  tags: '',
  attributes: '{\n  "vendor": "",\n  "criticality": ""\n}'
};

export default function FactSheetForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const lifecycles = useMemo(() => ['planned', 'active', 'target', 'retiring'], []);
  const subtypeOptions = useMemo(() => factSheetSubtypes[form.type] || [], [form.type]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => {
      if (name === 'type') {
        return {
          ...current,
          type: value,
          subtype: factSheetSubtypes[value]?.[0] || ''
        };
      }

      return { ...current, [name]: value };
    });
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

        <label>
          Lifecycle
          <select name="lifecycle" value={form.lifecycle} onChange={updateField}>
            {lifecycles.map((lifecycle) => (
              <option key={lifecycle} value={lifecycle}>
                {lifecycle}
              </option>
            ))}
          </select>
        </label>

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
