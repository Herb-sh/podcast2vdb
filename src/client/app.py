import streamlit as st
import streamlit.components.v1 as components
from my_component import my_component


res = my_component(name="World", key="sample_key")

#def main():
#    components.html(
#        open("template/index.html", 'r', encoding='utf-8').read(),
#        height=600,
#    )

#if __name__ == "__main__":
#    main()
