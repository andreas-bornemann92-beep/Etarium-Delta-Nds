# Etarium Nintendo DS homebrew build (devkitPro / devkitARM / libnds)
ifeq ($(strip $(DEVKITPRO)),)
$(error DEVKITPRO is not set. Install devkitPro with devkitARM and libnds)
endif
ifeq ($(strip $(DEVKITARM)),)
$(error DEVKITARM is not set. Install devkitARM)
endif

include $(DEVKITARM)/ds_rules

TARGET := etarium
BUILD := build
SOURCES := source
INCLUDES := include

ARCH := -mthumb -mthumb-interwork
CFLAGS := -g -Wall -Wextra -O2 -ffunction-sections -fdata-sections $(ARCH) $(INCLUDE)
CXXFLAGS := $(CFLAGS) -fno-rtti -fno-exceptions
ASFLAGS := -g $(ARCH)
LDFLAGS := -g $(ARCH) -Wl,--gc-sections -specs=ds_arm9.specs
LIBS := -lnds9
LIBDIRS := $(LIBNDS)

ifneq ($(BUILD),$(notdir $(CURDIR)))
export OUTPUT := $(CURDIR)/$(TARGET)
export VPATH := $(foreach dir,$(SOURCES),$(CURDIR)/$(dir))
export DEPSDIR := $(CURDIR)/$(BUILD)
export INCLUDE := $(foreach dir,$(INCLUDES),-I$(CURDIR)/$(dir))
export LIBPATHS := $(foreach dir,$(LIBDIRS),-L$(dir)/lib)
export LIBS
export OFILES := $(addprefix $(BUILD)/,$(notdir $(patsubst %.c,%.o,$(foreach dir,$(SOURCES),$(wildcard $(dir)/*.c)))))
.PHONY: all clean
all: $(BUILD)
	@$(MAKE) --no-print-directory -C $(BUILD) -f $(CURDIR)/Makefile
$(BUILD):
	@mkdir -p $@
clean:
	@rm -rf $(BUILD) $(TARGET).nds $(TARGET).elf
else
DEPENDS := $(OFILES:.o=.d)
.PHONY: all
all: $(OUTPUT).nds
$(OUTPUT).nds: $(OUTPUT).elf
$(OUTPUT).elf: $(OFILES)
-include $(DEPENDS)
endif
