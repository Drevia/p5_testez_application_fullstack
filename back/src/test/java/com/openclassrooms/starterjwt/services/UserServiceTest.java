package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserService userService;

    @Test
    void deleteUserOk() {
        Long userId = 1L;

        userService.delete(userId);
    
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    void findUserByIdOk() {
        User user = new User();
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        assertDoesNotThrow(() -> userService.findById(1L));
        verify(userRepository, times(1)).findById(1L);
    }
}
