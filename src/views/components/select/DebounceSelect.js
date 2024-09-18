import { useState, useMemo, useRef, useEffect } from "react"
import { Spin, Select } from "antd"
import debounce from 'lodash/debounce'
export const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([...props.options])
    const fetchRef = useRef(0)

    useEffect(() => {
      setOptions(props.options)
    }, [props.options])

    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        const data = options.filter((option) => (option?.label ?? '').toLowerCase().includes(value.toLowerCase()))
        if (data.length > 0) {
          setOptions(data)
        } else {
          fetchRef.current += 1
          const fetchId = fetchRef.current
          setOptions([])
          setFetching(true)
          fetchOptions(value).then((newOptions) => {
            if (fetchId !== fetchRef.current) {
              // for fetch callback order
              return
            }
            setOptions(newOptions)
            setFetching(false)
          })
  
        } 
       
      }
      
      return debounce(loadOptions, debounceTimeout)
    }, [fetchOptions, debounceTimeout])
  
    return (
      <Select
        allowClear
        filterOption={false}
        showSearch
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
        style={{width:"100%"}}
      />
    )
  }